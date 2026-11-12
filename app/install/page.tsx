import {FunnelShell} from "@/components/FunnelShell";

export default async function Page({searchParams}:{searchParams:Promise<{shop?:string;lead?:string}>}) {
  const {shop="",lead=""}=await searchParams;
  const q=new URLSearchParams({shop});
  if(/^[0-9a-f-]{36}$/i.test(lead)) q.set("lead",lead);

  return <FunnelShell>
    <h1 className="compact-title">Connect The AI Store Builder</h1>
    <div className="video">
      <video controls playsInline preload="metadata">
        <source src="/videos/ai-store-builder.mp4" type="video/mp4" />
      </video>
    </div>
    <h2>Ok It&apos;s Time To &quot;One Click&quot; Install The AI Store Builder</h2>
    <p>This step is imperative to having your personalized Professional Store built for you. If you don&apos;t install our AI Builder app, our store builder app will not be able to build your store.</p>
    <p>For our technology to safely build your store, you need to install the app on Shopify. This lets our builder access your store and complete the design and programming work for you.</p>
    <a className="btn" href={`/api/shopify/install?${q}`}>Connect Shopify</a>
  </FunnelShell>;
}
