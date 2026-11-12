const endpoint = () =>
  process.env.NMI_ENV === "sandbox"
    ? "https://sandbox.nmi.com/api/transact.php"
    : "https://secure.nmi.com/api/transact.php";

export type NmiCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
};

function nextMonthlyBillingDate() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  const lastDay = new Date(
    Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const billingDay = Math.min(now.getUTCDate(), lastDay);
  next.setUTCDate(billingDay);

  return {
    dayOfMonth: billingDay,
    startDate: `${next.getUTCFullYear()}${String(next.getUTCMonth() + 1).padStart(2, "0")}${String(billingDay).padStart(2, "0")}`,
  };
}

export async function chargeNmiToken(input: {
  paymentToken: string;
  amount: string;
  orderId: string;
  description: string;
  customer: NmiCustomer;
  recurring?: { amount: string; monthFrequency: number };
}) {
  const securityKey = process.env.NMI_PRIVATE_KEY;
  if (!securityKey) throw new Error("NMI is not configured");

  const payload = new URLSearchParams({
    security_key: securityKey,
    type: "sale",
    payment_token: input.paymentToken,
    amount: input.amount,
    currency: "USD",
    orderid: input.orderId.slice(0, 30),
    order_description: input.description.slice(0, 255),
    customer_vault: "add_customer",
    firstname: input.customer.firstName,
    lastname: input.customer.lastName,
    email: input.customer.email,
    phone: input.customer.phone,
    address1: input.customer.address,
    city: input.customer.city,
    state: input.customer.state,
    zip: input.customer.zip,
    country: input.customer.country || "US",
  });
  if (input.recurring) {
    const schedule = nextMonthlyBillingDate();
    payload.set("recurring", "add_subscription");
    payload.set("plan_payments", "0");
    payload.set("plan_amount", input.recurring.amount);
    payload.set("month_frequency", String(input.recurring.monthFrequency));
    payload.set("day_of_month", String(schedule.dayOfMonth));
    payload.set("start_date", schedule.startDate);
  }

  const response = await fetch(endpoint(), {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: payload,
    cache: "no-store",
  });
  const result = Object.fromEntries(new URLSearchParams(await response.text()));
  if (!response.ok || result.response !== "1") {
    return {
      ok: false as const,
      message: result.responsetext || "The payment was declined. Please verify your details or try another card.",
      responseCode: result.response_code || result.response || "declined",
    };
  }
  return {
    ok: true as const,
    transactionId: result.transactionid || "",
    authCode: result.authcode || "",
    customerVaultId: result.customer_vault_id || "",
  };
}
