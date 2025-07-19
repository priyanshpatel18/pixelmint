import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { NFT } from "@/types/nft";

interface HeliusNFT {
  id: string; // mint address
  content: {
    metadata?: {
      name?: string;
      symbol?: string;
    };
    links?: {
      image?: string;
    };
  };
}

export function useHeliusNFTs() {
  const { publicKey } = useWallet();

  return useQuery<NFT[]>({
    queryKey: ["helius-nfts", publicKey?.toBase58()],
    enabled: !!publicKey,
    queryFn: async () => {
      if (!publicKey) throw new Error("Wallet not connected");

      const res = await fetch(`/api/helius/nft?address=${publicKey.toBase58()}`);
      if (!res.ok) throw new Error("Failed to fetch NFTs");

      const raw = await res.json();

      const items: HeliusNFT[] = raw.result?.items ?? [];
      return items
        .filter((nft) => nft.content?.metadata?.name && nft.content?.links?.image)
        .map((nft): NFT => ({
          mint: nft.id,
          name: nft.content.metadata?.name ?? "Unnamed NFT",
          symbol: nft.content.metadata?.symbol ?? "",
          image: nft.content.links?.image ?? "",
        }));
    },
  });
}
