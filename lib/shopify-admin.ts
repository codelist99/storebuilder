import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { db } from "@/lib/db";

const API_VERSION = "2026-10";

type GraphqlResponse<T> = { data?: T; errors?: Array<{ message: string }> };

export async function connectedShop(shopDomain: string) {
  const sql = db();
  const rows = await sql`
    select id, shop_domain, access_token_encrypted, refresh_token_encrypted,
      access_token_expires_at, refresh_token_expires_at, selected_plan
    from shops
    where shop_domain = ${shopDomain} and connection_status = 'connected'
    limit 1
  `;
  const shop = rows[0];
  if (!shop?.access_token_encrypted) throw new Error("Shopify store is not connected");
  let accessToken = decryptSecret(String(shop.access_token_encrypted));
  const expiresAt = shop.access_token_expires_at ? new Date(String(shop.access_token_expires_at)).getTime() : 0;
  if (expiresAt && expiresAt <= Date.now() + 5 * 60 * 1000) {
    if (!shop.refresh_token_encrypted) throw new Error("Shopify authorization must be renewed");
    const clientId = process.env.SHOPIFY_API_KEY;
    const clientSecret = process.env.SHOPIFY_API_SECRET;
    if (!clientId || !clientSecret) throw new Error("Shopify app is not configured");
    const response = await fetch(`https://${shop.shop_domain}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: decryptSecret(String(shop.refresh_token_encrypted))
      }),
      cache: "no-store"
    });
    const refreshed = await response.json() as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      refresh_token_expires_in?: number;
    };
    if (!response.ok || !refreshed.access_token || !refreshed.refresh_token || !refreshed.expires_in) {
      throw new Error("Shopify authorization must be renewed");
    }
    accessToken = refreshed.access_token;
    await sql`
      update shops set
        access_token_encrypted = ${encryptSecret(refreshed.access_token)},
        refresh_token_encrypted = ${encryptSecret(refreshed.refresh_token)},
        access_token_expires_at = now() + (${refreshed.expires_in} * interval '1 second'),
        refresh_token_expires_at = now() + (${refreshed.refresh_token_expires_in || 0} * interval '1 second'),
        updated_at = now()
      where id = ${shop.id}
    `;
  }
  return {
    id: String(shop.id),
    domain: String(shop.shop_domain),
    accessToken,
    plan: String(shop.selected_plan)
  };
}

export async function adminGraphql<T>(shop: { domain: string; accessToken: string }, query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(`https://${shop.domain}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": shop.accessToken },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });
  const payload = await response.json() as GraphqlResponse<T>;
  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.map(({ message }) => message).join("; ") || `Shopify API returned ${response.status}`);
  }
  if (!payload.data) throw new Error("Shopify API returned no data");
  return payload.data;
}

export async function createPageIfMissing(shop: { domain: string; accessToken: string }, page: { title: string; handle: string; body: string }) {
  const existing = await adminGraphql<{ pages: { nodes: Array<{ id: string }> } }>(shop, `
    query ExistingPage($query: String!) {
      pages(first: 1, query: $query) { nodes { id } }
    }
  `, { query: `handle:${page.handle}` });
  if (existing.pages.nodes[0]) return existing.pages.nodes[0].id;

  const created = await adminGraphql<{
    pageCreate: { page: { id: string } | null; userErrors: Array<{ message: string }> }
  }>(shop, `
    mutation CreatePage($page: PageCreateInput!) {
      pageCreate(page: $page) { page { id } userErrors { message } }
    }
  `, { page: { ...page, isPublished: true } });
  if (created.pageCreate.userErrors.length || !created.pageCreate.page) {
    throw new Error(created.pageCreate.userErrors.map(({ message }) => message).join("; ") || `Unable to create ${page.title}`);
  }
  return created.pageCreate.page.id;
}
