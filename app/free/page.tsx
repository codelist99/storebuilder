import { Suspense } from "react";
import { LiveStoreLanding } from "@/components/LiveStoreLanding";

export default function FreeStorePage() {
  return <Suspense fallback={null}><LiveStoreLanding /></Suspense>;
}
