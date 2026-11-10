import { Suspense } from "react";
import { LiveStoreLanding } from "@/components/LiveStoreLanding";

export default function Home() {
  return <Suspense fallback={null}><LiveStoreLanding /></Suspense>;
}
