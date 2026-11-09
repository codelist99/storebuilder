import { redirect } from "next/navigation";
import { FunnelShell } from "@/components/FunnelShell";

async function begin(formData: FormData) {
  "use server";
  const params = new URLSearchParams({
    firstName: String(formData.get("firstName") || ""),
    lastName: String(formData.get("lastName") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || "")
  });
  redirect(`/create-shopify?${params.toString()}`);
}

export default function StartPage() {
  return (
    <FunnelShell>
      <h1>Reserve your free store build</h1>
      <form action={begin} className="form-grid">
        <label className="field">First name<input name="firstName" required /></label>
        <label className="field">Last name<input name="lastName" required /></label>
        <label className="field">Email<input name="email" type="email" required /></label>
        <label className="field">Phone<input name="phone" type="tel" required /></label>
        <button className="btn wide" type="submit">Continue</button>
      </form>
    </FunnelShell>
  );
}
