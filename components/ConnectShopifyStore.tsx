"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
const SHOP_PATTERN = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;
const normalizeShop = (value: string) => value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");

export function ConnectShopifyStore({ lead, initialShop }: { lead: string; initialShop: string }) {
  const router = useRouter();
  const normalizedInitial = normalizeShop(initialShop);
  const [shop, setShop] = useState(normalizedInitial);
  const [savedShop, setSavedShop] = useState(SHOP_PATTERN.test(normalizedInitial) ? normalizedInitial : "");
  const [error, setError] = useState("");
  function saveShop(event: FormEvent) {
    event.preventDefault();
    const normalized = normalizeShop(shop);
    if (!SHOP_PATTERN.test(normalized)) { setSavedShop(""); setError("Please enter your permanent .myshopify.com store address."); return; }
    setShop(normalized); setSavedShop(normalized); setError("");
  }
  function continueToInstall() {
    if (!savedShop || savedShop !== normalizeShop(shop)) { setError("Save your Shopify URL before continuing."); return; }
    const query = new URLSearchParams({ shop: savedShop });
    if (/^[0-9a-f-]{36}$/i.test(lead)) query.set("lead", lead);
    router.push(`/install?${query.toString()}`);
  }
  return <div className="connect-shopify-page">
    <h1 className="connect-title">✅ Connect your Shopify Store</h1>
    <p>Now that you&apos;ve opened your Shopify store, we need to connect our 1-click store builder app to your store.</p>
    <p>To do this, we need you to provide us with the URL address of your Shopify store in the field below.</p>
    <p className="connect-important"><strong>To find your stores URL address (<mark>yourstorename.myshopify.com</mark>) you can follow either two of these steps.</strong>{" "}<span>This is extremely important so our AI can connect and build your store.</span></p>
    <p className="connect-option"><strong>Option 1:</strong> Look at the URL bar while logged in to your shopify store.</p>
    <Image className="connect-instruction connect-address-example" src="/builder/shopify-url-example.svg" alt="Example showing where to find a myshopify.com URL in the browser address bar" width={720} height={126} priority />
    <p className="connect-option"><strong>Option 2:</strong> If your &quot;storename.myshopify.com&quot; URL is not showing via step 1, then you can find it by clicking on the bottom left corner of your admin panel &quot;Settings&quot;.</p>
    <Image className="connect-instruction connect-settings-example" src="/builder/shopify-settings-example.svg" alt="Shopify settings screen showing the permanent myshopify.com store address" width={760} height={430} priority />
    <p className="copy-heading"><strong>To copy your store&apos;s URL address, follow these steps:</strong></p>
    <ol className="connect-steps"><li>Go back to the Shopify tab;</li><li>Copy the address into your browser&apos;s address bar, as in the image below</li><li><mark>Return to this tab;</mark></li><li>Paste the address in the field below;</li><li>Click on the Save button;</li><li>Click the ✅ Done button to continue</li></ol>
    <form className="shop-url-form" onSubmit={saveShop} noValidate><label className="shop-url-field"><span>URL</span><input value={shop} onChange={(event) => { setShop(event.target.value); setSavedShop(""); setError(""); }} placeholder="your-store.myshopify.com" aria-label="Your Shopify URL"/><button type="submit">Save</button></label></form>
    {error && <p className="connect-error" role="alert">{error}</p>}{savedShop && <p className="connect-saved">Shopify URL saved.</p>}
    <button type="button" className="connect-done" onClick={continueToInstall}>✅ Done</button>
    <div className="next-preview connect-next"><small>🟡 Next</small><h2>Connect The AI Store Builder</h2></div>
  </div>;
}
