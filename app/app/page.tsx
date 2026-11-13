import Link from "next/link";
import { normalizeShop } from "@/lib/shopify";
import styles from "./app-home.module.css";

type AppHomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AppHome({ searchParams }: AppHomeProps) {
  const params = await searchParams;
  const shop = normalizeShop(firstValue(params.shop) ?? null);
  const query = shop ? `?shop=${encodeURIComponent(shop)}` : "";

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <div className={styles.brand}>BuildMyStore</div>
        <div className={styles.badge}>Shopify app connected</div>
        <h1>Build and customize your store</h1>
        <p className={styles.intro}>
          Continue the guided setup to choose your store design, connect your
          catalog, and prepare your storefront for launch.
        </p>

        {shop ? (
          <p className={styles.store}>
            Connected store: <strong>{shop}</strong>
          </p>
        ) : (
          <p className={styles.notice}>
            Open BuildMyStore from your Shopify admin to connect your store.
          </p>
        )}

        <div className={styles.actions}>
          <Link className={styles.primary} href={`/store-color${query}`}>
            Continue building my store
          </Link>
          {shop ? (
            <a
              className={styles.secondary}
              href={`https://${shop}/admin`}
              target="_top"
            >
              Return to Shopify admin
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}
