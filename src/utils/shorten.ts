import { PublicKey } from "@solana/web3.js";

export function shorten(pubkey: string | PublicKey | undefined, chars = 8): string {
  return pubkey ? pubkey.toString().slice(0, chars) : 'N/A';
}
