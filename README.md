# StoreBuilder

Independent Shopify store-builder funnel and app foundation. This repository is isolated from the existing offer projects.

## Confirmed reference flow

1. Lead registration.
2. Shopify account creation through a partner/affiliate link.
3. Customer supplies the permanent `.myshopify.com` domain.
4. Customer authorizes a Shopify app through OAuth.
5. Premium Store offer at $97.
6. Decline leads to a $47 Premium Store downsell.
7. The observed $47 checkout contains a $17 Product Sniper Software order bump.
8. Free and paid paths converge on automated store setup.
9. Customer removes Shopify storefront password protection.
10. Store-ready screen transitions into Step 2, product loading.

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

Apply [`db/migrations/001_initial.sql`](db/migrations/001_initial.sql) to a dedicated Lakebase Postgres database using its direct connection URL. Use the pooled `DATABASE_URL` for application traffic.

## Shopify Partner setup

Create a new Shopify Partner app owned by this project. Configure:

- App URL: the deployed application URL.
- Allowed callback URL: `https://YOUR_DOMAIN/api/shopify/callback`.
- Required Admin API scopes in `SHOPIFY_SCOPES`.
- App uninstall webhook before production traffic.

Never reuse or copy the reference operator's Shopify credentials, private app, access tokens, database, or checkout processor. `SESSION_SECRET` encrypts stored offline Shopify tokens and must be at least 32 random characters.

## Current implementation boundary

Implemented: mapped funnel UI, Shopify OAuth authorization and HMAC validation, encrypted token persistence, premium/downsell branches, build/publish/ready screens, and initial database schema.

Still required before traffic:

- Create and approve our Shopify Partner app.
- Build the theme/page/menu installer against Shopify Admin APIs.
- Define our licensed theme and product catalog.
- Add checkout/webhook integrations for $97, $47, and the optional bump.
- Recover or recreate licensed sales videos and set their environment URLs.
- Implement Step 2 product/supplier workflow.
- Add uninstall and mandatory privacy webhooks.
- Add customer sessions, rate limiting, monitoring, tests, and admin reporting.
