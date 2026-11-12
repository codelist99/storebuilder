"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const colors = ["#e52626", "#173fc5", "#ff7417", "#16a34a", "#8a2be2", "#8b4a1d", "#13958c", "#000"];

export function ColorChoice({ query = "" }: { query?: string }) {
  const [selected, setSelected] = useState(1);
  const router = useRouter();

  function continueToBanners() {
    try { localStorage.setItem("bms-color", colors[selected]); } catch {}
    const destination = "/banners" + (query ? "?" + query : "");
    router.push(destination);
  }

  return <>
    <h1 className="compact-title">Set your Store color</h1>
    <p>Select your store&apos;s main color:</p>
    <p><strong>This software works best on a desktop or laptop. You will receive your password in your email.</strong></p>
    <h2>Select your store&apos;s main color:</h2>
    <div className="color-grid">
      {colors.map((color, index) => <button type="button" key={color} aria-label={"Choose color " + (index + 1)} className={"color-choice " + (selected === index ? "active" : "")} style={{ background: color }} onClick={() => setSelected(index)}>{selected === index ? "✓" : ""}</button>)}
    </div>
    <button type="button" className="btn outline-green" onClick={continueToBanners}>☑ Done</button>
    <div className="next-preview">🟡 Next<h2>Choose your banners for your homepage</h2></div>
  </>;
}

export function BannerChoice({ query = "" }: { query?: string }) {
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();

  function toggle(index: number) {
    setSelected(current => current.includes(index) ? current.filter(item => item !== index) : current.length < 2 ? [...current, index] : current);
  }

  function continueToShopify() {
    if (selected.length !== 2) return;
    try { localStorage.setItem("bms-banners", JSON.stringify(selected)); } catch {}
    const destination = "/create-shopify" + (query ? "?" + query : "");
    router.push(destination);
  }

  return <>
    <h1 className="compact-title">Choose your banners for your homepage</h1>
    <p>Select the 2 banners that will be on your store&apos;s homepage:</p>
    <div className="banner-grid">
      {[1, 2, 3, 4, 5, 6].map((number, index) => <button type="button" key={number} aria-pressed={selected.includes(index)} className={"banner-choice " + (selected.includes(index) ? "active" : "")} onClick={() => toggle(index)}><img src={"/builder/banner-" + number + ".png"} alt={"Store banner " + number} /></button>)}
    </div>
    <button type="button" className="btn outline-green" disabled={selected.length !== 2} onClick={continueToShopify}>☑ Done</button>
    {selected.length !== 2 && <p className="selection-help">Select exactly two banners to continue.</p>}
    <div className="next-preview">🟡 Next<h2>✅ Open Your Shopify Account + FREE Bonuses</h2></div>
  </>;
}
