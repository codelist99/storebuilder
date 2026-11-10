import { Suspense } from "react";
import { WebinarRoom } from "@/components/WebinarRoom";

export default function WebinarPage() {
  return <Suspense fallback={null}><WebinarRoom /></Suspense>;
}
