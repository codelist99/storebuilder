import { redirect } from "next/navigation";
import { FunnelShell } from "@/components/FunnelShell";

async function connect(formData: FormData) {
  "use server";
  const raw = String(formData.get("shop") || "").trim().toLowerCase();
  const shop = raw.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) redirect("/connect?error=invalid");
  const lead = String(formData.get("lead") || "");
  const query = new URLSearchParams({ shop });
  if (/^[0-9a-f-]{36}$/i.test(lead)) query.set("lead", lead);
  redirect(`/install?${query.toString()}`);
}

export default async function ConnectPage({ searchParams }: { searchParams: Promise<{ error?: string; lead?: string }> }) {
  const { error, lead = "" } = await searchParams;
  return (
    <FunnelShell>
      <h1>✅ Connect your Shopify Store</h1>
      <p>Enter the permanent Shopify address shown inside your Shopify settings. It looks like <strong>your-store.myshopify.com</strong>.</p>
      {error && <p className="notice">Please enter a valid .myshopify.com address.</p>}
      <form action={connect} className="form-grid">
        <input type="hidden" name="lead" value={lead} />
        <label className="field wide">Shopify URL<input name="shop" placeholder="your-store.myshopify.com" required /></label>
        <button className="btn wide" type="submit">Save and continue</button>
      </form>
    </FunnelShell>
  );
}
