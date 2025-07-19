"use client";

import { NFT } from "@/types/nft";
import { shorten } from "@/utils/shorten";
import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";

export function ListDialog({ nft }: { nft: NFT }) {
  const [price, setPrice] = useState("");

  const handleList = () => {
    
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">List</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List NFT</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-12 h-12 object-cover rounded border"
            />
            <div>
              <p className="text-sm font-medium">{shorten(nft.name, 20)}</p>
              <p className="text-xs text-muted-foreground">
                {shorten(nft.mint)}
              </p>
            </div>
          </div>
          <Input
            type="number"
            placeholder="Enter price in SOL"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleList} disabled={!price}>
            Confirm Listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
