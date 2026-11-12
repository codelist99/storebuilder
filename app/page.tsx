import OptinLanding from "./OptinLanding";

type SearchValue = string | string[] | undefined;

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, SearchValue>> }) {
  const raw = await searchParams;
  const attribution = Object.fromEntries(
    Object.entries(raw).flatMap(([key, value]) => {
      const normalized = Array.isArray(value) ? value[0] : value;
      return normalized ? [[key, normalized]] : [];
    }),
  );
  return <OptinLanding attribution={attribution} />;
}
