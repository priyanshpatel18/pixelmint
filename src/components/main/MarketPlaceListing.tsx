import { TrendingUp } from "lucide-react";

export function MarketplaceListings() {
  return (
    <div>
      <div className="text-center py-12">
        <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No NFTs Listed Yet</h3>
        <p className="text-muted-foreground">Be the first to list an NFT on the marketplace!</p>
      </div>
    </div>
  )
}