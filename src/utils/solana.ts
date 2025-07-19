import { Program, Provider } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "./idl/marketplace.json";

export const programId = new PublicKey("broQPt5f3vtMniWxwJLeHK5X56pGgor4Qmpd9jMVLYT");

export default async function getProgram(provider: Provider, address?: PublicKey) {
  return new Program({
    ...idl,
    address: address ? address.toBase58() : programId.toBase58(),
    provider
  })
}