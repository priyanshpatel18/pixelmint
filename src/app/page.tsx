"use client";

import { MarketplaceListings } from "@/components/main/MarketPlaceListing";
import { MyNFTsSidebar } from "@/components/NFTSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Wallet
} from 'lucide-react';

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <MarketplaceHeader />
        <MarketplaceListings />
      </div>
    </div>
  );
}

function MarketplaceHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">NFT Marketplace</h1>
        <p className="text-muted-foreground">Discover, buy, and sell unique digital assets</p>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Wallet className="h-4 w-4 mr-2" />
            My NFTs
          </Button>
        </SheetTrigger>
        <SheetContent className="w-96 sm:w-96">
          <SheetHeader>
            <SheetTitle>My NFT Collection</SheetTitle>
            <SheetDescription>
              Manage and list your NFTs for sale
            </SheetDescription>
          </SheetHeader>
          <MyNFTsSidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}