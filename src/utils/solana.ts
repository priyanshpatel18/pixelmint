import { Marketplace } from "@/types/marketplace";
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import idl from "./idl/marketplace.json";

export const programId = new PublicKey("broQPt5f3vtMniWxwJLeHK5X56pGgor4Qmpd9jMVLYT");

const connection = new Connection("https://api.devnet.solana.com", 'confirmed');

export default async function getProgram(wallet: anchor.Wallet) {
  const provider = new anchor.AnchorProvider(connection, wallet, { preflightCommitment: "confirmed" })
  anchor.setProvider(provider);
  return new anchor.Program(idl as unknown as Marketplace, provider);
}