import { useHeliusNFTs } from "@/hooks/useHeliusNFTs";
import { Skeleton } from "./ui/skeleton";
import { shorten } from "@/utils/shorten";
import { NFT } from "@/types/nft";

export function MyNFTsSidebar() {
  const { data: nfts, isLoading, isError } = useHeliusNFTs();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="w-16 h-16 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !nfts?.length) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No NFTs found in your wallet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">My NFTs ({nfts.length})</h3>
      </div>

      {nfts.map((nft: NFT) => (
        <div key={nft.mint} className="flex gap-3 p-3 rounded-lg border bg-card">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-16 h-16 object-cover rounded border"
          />
          <div className="flex-1 space-y-1">
            <h4 className="font-medium text-sm truncate">{shorten(nft.name, 20)}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {shorten(nft.mint)}...
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}