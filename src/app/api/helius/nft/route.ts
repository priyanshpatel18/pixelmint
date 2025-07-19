import { NextResponse } from "next/server";

const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Missing address" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "1",
        method: "getAssetsByOwner",
        params: {
          ownerAddress: address,
          page: 1,
          limit: 10,
        },
      }),
    });
    const data = await response.json();
console.log(data);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Helius fetch failed:", err);
    return NextResponse.json({ error: "Failed to fetch from Helius" }, { status: 500 });
  }
}
