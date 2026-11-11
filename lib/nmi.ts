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

export async function chargeNmiToken(input: {
  paymentToken: string;
  amount: string;
  orderId: string;
  description: string;
  customer: NmiCustomer;
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
