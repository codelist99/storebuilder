import OptinLanding from "./OptinLanding";
import { redirect } from "next/navigation";

type SearchValue = string | string[] | undefined;

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, SearchValue>> }) {
  const raw = await searchParams;
  const attribution = Object.fromEntries(
    Object.entries(raw).flatMap(([key, value]) => {
      const normalized = Array.isArray(value) ? value[0] : value;
      return normalized ? [[key, normalized]] : [];
    }),
  );

  const isShopifyAppLaunch = ["shop", "host", "embedded", "id_token", "hmac"].some(
    (key) => typeof attribution[key] === "string",
  );

  if (isShopifyAppLaunch) {
    const query = new URLSearchParams(attribution).toString();
    redirect(`/app${query ? `?${query}` : ""}`);
  }

  return <OptinLanding attribution={attribution} />;
}
