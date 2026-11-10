"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const VIDEO = "https://player.vimeo.com/progressive_redirect/playback/1149918693/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&signature=f86d1727b02d17f3d5a1dcf1a2d881226ed5064a5a39d9971934dfe9693e34bf";
const SHOPIFY = "https://www.shopify.com/commerce-coach/adrianmorrison?irclickid=Rv3W4IVAFxyZUay1A42jOzL0UkryvY29rziW3s0&irgwc=1&partner=3219387&affpt=excluded&utm_channel=affiliates&utm_source=3219387-impact&utm_medium=cpa&iradid=1061744";

type Tab = "chat" | "qa" | "people";
type Message = { at: number; author: string; time: string; body: React.ReactNode; announcement?: boolean };

function clock(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}` : `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function WebinarRoom() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const query = useSearchParams();
  const [tab, setTab] = useState<Tab>("chat");
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [draft, setDraft] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [comments, setComments] = useState<string[]>([]);

  const hostMessages: Message[] = useMemo(() => [
    { at: 25, author: "Adrian Morrison", time: "LIVE", body: <>Welcome! Today we&apos;re building your new ecommerce store together LIVE.</> },
    { at: 420, author: "Adrian Morrison", time: "LIVE", body: <>Stay with us through the training—your store setup steps will be posted here in the chat.</> },
    { at: 1545, author: "Adrian Morrison", time: "26:00", body: <>Get your Shopify trial at <a href={SHOPIFY} target="_blank" rel="noreferrer" onClick={trackShopify}>BuildMyStore Shopify Access</a></> },
    { at: 1560, author: "Adrian Morrison", time: "26:15", body: <>Yes—this is how we make our money. If you don&apos;t open an account with our link, then we don&apos;t get paid. We build your store, load it with products and fully take care of everything because Shopify pays us a commission.</> },
    { at: 1575, author: "Adrian Morrison", time: "26:30", body: <>Get Shopify Trial Now at <a href={SHOPIFY} target="_blank" rel="noreferrer" onClick={trackShopify}>our official BuildMyStore link</a></> },
    { at: 1590, author: "Adrian Morrison", time: "26:45", announcement: true, body: <>IMPORTANT: Open your Shopify account with the BuildMyStore link, then return here and continue the training.</> },
    { at: 1620, author: "Adrian Morrison", time: "27:15", body: <>Once your Shopify account is open, keep this webinar tab available—we&apos;ll walk you through connecting it to the AI Store Builder.</> }
  ], []);
  const visibleMessages = hostMessages.filter((message) => elapsed >= message.at);
  const viewers = Math.max(286, Math.min(532, 340 + Math.floor(elapsed / 14) + Math.round(18 * Math.sin(elapsed / 31))));

  function trackShopify() {
    navigator.sendBeacon?.("/api/events", JSON.stringify({ event: "shopify_affiliate_clicked", seconds: elapsed, source: Object.fromEntries(query.entries()) }));
  }
  function submitMessage(event: FormEvent) {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    if (tab === "qa") setQuestions((items) => [...items, value]); else setComments((items) => [...items, value]);
    setDraft("");
  }

  return (
    <main className="webinar-room">
      <header className="webinar-header"><div>Build Your Store <strong>LIVE</strong> with Adrian Morrison</div><div className="webinar-counters"><span>LIVE: {clock(elapsed)}</span><b>◉ &nbsp;{viewers}</b></div></header>
      <div className="webinar-body">
        <section className="webinar-stage">
          <video ref={videoRef} src={VIDEO} autoPlay muted playsInline controls onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)} onEnded={() => router.push(`/create-shopify?${query.toString()}`)} />
          {!playing && <button className="webinar-play" onClick={() => videoRef.current?.play()}>▶ <span>CLICK TO JOIN THE LIVE SESSION</span></button>}
        </section>
        <aside className="webinar-sidebar">
          <nav><button className={tab === "chat" ? "active" : ""} onClick={() => setTab("chat")}>Chat</button><button className={tab === "qa" ? "active" : ""} onClick={() => setTab("qa")}>Q&amp;A</button><button className={tab === "people" ? "active" : ""} onClick={() => setTab("people")}>People</button></nav>
          {tab === "chat" && <><div className="public-pill">Public</div><div className="message-list">{visibleMessages.map((message, index) => <article className={message.announcement ? "announcement" : ""} key={`${message.at}-${index}`}><img src="/landing/adrian-morrison.jpg" alt="Adrian Morrison" /><div><div className="message-meta"><strong>{message.author}</strong><small>{message.time}</small></div><p>{message.body}</p></div></article>)}{comments.map((message, index) => <article key={`comment-${index}`}><div className="guest-avatar">Y</div><div><div className="message-meta"><strong>You</strong><small>NOW</small></div><p>{message}</p></div></article>)}</div></>}
          {tab === "qa" && <div className="qa-panel"><h3>Questions &amp; Answers</h3><p>Ask Adrian and Anthony a question about building your Shopify store.</p>{questions.map((question, index) => <div className="question" key={index}><strong>You asked:</strong> {question}</div>)}</div>}
          {tab === "people" && <div className="people-panel"><div className="people-switch"><b>Hosts</b><span>Attendees</span></div><article><img src="/landing/adrian-morrison.jpg" alt="Adrian Morrison" /><strong>Adrian Morrison</strong></article><article><div className="guest-avatar">AM</div><strong>Anthony Morrison</strong></article></div>}
          {tab !== "people" && <form className="webinar-compose" onSubmit={submitMessage}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={tab === "qa" ? "Ask a question" : "Send a message"} /><button>➤</button></form>}
        </aside>
      </div>
    </main>
  );
}
