'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  Crown,
  DollarSign,
  Eye,
  Grid,
  List,
  Loader2,
  Search,
  ShoppingCart,
  Tag,
  TrendingUp,
  Wallet,
  XCircle
} from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

// Types
interface NFTAttribute {
  trait_type: string
  value: string
}

interface NFT {
  mint: string
  name: string
  description: string
  image: string
  attributes: NFTAttribute[]
  collection?: string
  owner: string
  isListed: boolean
  price?: number
  listingId?: string
  rarity?: string
}

interface ListingData {
  price: number
  nft: NFT
}

// Mock data for demonstration
const mockNFTs: NFT[] = [
  {
    mint: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "Cosmic Warrior #1",
    description: "A legendary warrior from the cosmic realm",
    image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=400&fit=crop",
    attributes: [
      { trait_type: "Background", value: "Nebula" },
      { trait_type: "Armor", value: "Legendary" },
      { trait_type: "Weapon", value: "Plasma Sword" }
    ],
    owner: "user123",
    isListed: true,
    price: 2.5,
    listingId: "listing1",
    rarity: "Legendary"
  },
  {
    mint: "9yGp2dh3PQa8WqP1BvB3jHsSRt8VQx4A5TZRuJosgAsU",
    name: "Digital Dreams #42",
    description: "A surreal journey through digital landscapes",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    attributes: [
      { trait_type: "Style", value: "Abstract" },
      { trait_type: "Colors", value: "Vibrant" },
      { trait_type: "Mood", value: "Dreamy" }
    ],
    owner: "marketplace",
    isListed: true,
    price: 1.8,
    listingId: "listing2",
    rarity: "Rare"
  },
  {
    mint: "3xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    name: "My Creation #1",
    description: "My first NFT creation",
    image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop",
    attributes: [
      { trait_type: "Type", value: "Original" },
      { trait_type: "Edition", value: "First" }
    ],
    owner: "currentUser", // This would be the connected wallet
    isListed: false,
    rarity: "Common"
  }
]

export default function MarketplacePage() {
  const { publicKey: walletPublicKey, connected } = useWallet()
  const [activeTab, setActiveTab] = useState('marketplace')
  const [nfts, setNfts] = useState<NFT[]>(mockNFTs)
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>(mockNFTs)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' })
  const [rarityFilter, setRarityFilter] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null)
  const [listingPrice, setListingPrice] = useState('')
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false)

  // Get user's NFTs
  const userNfts = nfts.filter(nft => nft.owner === 'currentUser')

  // Get marketplace NFTs (listed by others)
  const marketplaceNfts = nfts.filter(nft => nft.isListed && nft.owner !== 'currentUser')

  // Filter and search functionality
  const applyFilters = useCallback(() => {
    const userNfts = nfts.filter(nft => nft.owner === 'currentUser')
    const marketplaceNfts = nfts.filter(nft => nft.isListed && nft.owner !== 'currentUser')

    let filtered = activeTab === 'marketplace' ? marketplaceNfts : userNfts

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(nft =>
        nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Price filter (only for marketplace)
    if (activeTab === 'marketplace' && (priceFilter.min || priceFilter.max)) {
      filtered = filtered.filter(nft => {
        if (!nft.price) return false
        const price = nft.price
        const min = priceFilter.min ? parseFloat(priceFilter.min) : 0
        const max = priceFilter.max ? parseFloat(priceFilter.max) : Infinity
        return price >= min && price <= max
      })
    }

    // Rarity filter
    if (rarityFilter) {
      filtered = filtered.filter(nft => nft.rarity === rarityFilter)
    }

    setFilteredNfts(filtered)
  }, [nfts, activeTab, searchQuery, priceFilter, rarityFilter])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // List NFT on marketplace
  const handleListNft = async (nft: NFT, price: number) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setNfts(prev => prev.map(n =>
        n.mint === nft.mint
          ? { ...n, isListed: true, price, listingId: `listing_${Date.now()}` }
          : n
      ))

      toast.success('NFT Listed Successfully!', {
        description: `${nft.name} is now listed for ${price} SOL`
      })

      setIsListingDialogOpen(false)
      setListingPrice('')
    } catch (error) {
      toast.error('Failed to list NFT', {
        description: 'Please try again later'
      })
    } finally {
      setLoading(false)
    }
  }

  // Delist NFT from marketplace
  const handleDelistNft = async (nft: NFT) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setNfts(prev => prev.map(n =>
        n.mint === nft.mint
          ? { ...n, isListed: false, price: undefined, listingId: undefined }
          : n
      ))

      toast.success('NFT Delisted Successfully!', {
        description: `${nft.name} has been removed from the marketplace`
      })
    } catch (error) {
      toast.error('Failed to delist NFT', {
        description: 'Please try again later'
      })
    } finally {
      setLoading(false)
    }
  }

  // Purchase NFT
  const handlePurchaseNft = async (nft: NFT) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setNfts(prev => prev.map(n =>
        n.mint === nft.mint
          ? { ...n, owner: 'currentUser', isListed: false, price: undefined, listingId: undefined }
          : n
      ))

      toast.success('NFT Purchased Successfully!', {
        description: `${nft.name} is now in your wallet`
      })
    } catch (error) {
      toast.error('Failed to purchase NFT', {
        description: 'Please try again later'
      })
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500'
      case 'Rare': return 'bg-gradient-to-r from-purple-400 to-pink-400'
      case 'Common': return 'bg-gradient-to-r from-blue-400 to-cyan-400'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500'
    }
  }

  const NFTCard = ({ nft, isOwned = false }: { nft: NFT; isOwned?: boolean }) => (
    <Card className="group overflow-hidden rounded-xl border-0 bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="relative overflow-hidden">
        <img
          src={nft.image}
          alt={nft.name}
          width={400}
          height={400}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {nft.rarity && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white ${getRarityColor(nft.rarity)}`}>
            <Crown className="inline h-3 w-3 mr-1" />
            {nft.rarity}
          </div>
        )}
        {nft.isListed && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Listed
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {nft.name}
          </h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-muted">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{nft.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <img
                  src={nft.image}
                  alt={nft.name}
                  width={400}
                  height={400}
                  className="w-full rounded-lg"
                />
                <div className="space-y-4">
                  <p className="text-muted-foreground">{nft.description}</p>
                  {nft.attributes.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Attributes</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {nft.attributes.map((attr, index) => (
                          <div key={index} className="bg-muted rounded p-2">
                            <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                            <div className="font-medium">{attr.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    <div>Mint: {nft.mint.slice(0, 8)}...{nft.mint.slice(-8)}</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {nft.description}
        </p>

        {nft.attributes.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {nft.attributes.slice(0, 2).map((attr, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {attr.trait_type}: {attr.value}
                </Badge>
              ))}
              {nft.attributes.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{nft.attributes.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {nft.price && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-bold text-lg">{nft.price} SOL</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {isOwned ? (
            nft.isListed ? (
              <Button
                onClick={() => handleDelistNft(nft)}
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Delist
              </Button>
            ) : (
              <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setSelectedNft(nft)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    List for Sale
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>List NFT for Sale</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedNft?.image || ''}
                        alt={selectedNft?.name || ''}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold">{selectedNft?.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedNft?.description}</p>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="listing-price">Price (SOL)</Label>
                      <Input
                        id="listing-price"
                        type="number"
                        step="0.1"
                        value={listingPrice}
                        onChange={(e) => setListingPrice(e.target.value)}
                        placeholder="Enter price in SOL"
                      />
                    </div>
                    <Button
                      onClick={() => selectedNft && handleListNft(selectedNft, parseFloat(listingPrice))}
                      disabled={!listingPrice || loading}
                      className="w-full"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Tag className="h-4 w-4 mr-2" />}
                      List NFT
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )
          ) : (
            <Button
              onClick={() => handlePurchaseNft(nft)}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
              Buy Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            NFT Marketplace
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover, collect, and trade unique digital assets. Your gateway to the world of NFTs.
          </p>
        </div>

        {connected ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">My NFTs</p>
                      <p className="text-2xl font-bold">{userNfts.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Listed</p>
                      <p className="text-2xl font-bold">{userNfts.filter(nft => nft.isListed).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500 rounded-xl">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-2xl font-bold">{marketplaceNfts.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <TabsList className="grid w-full lg:w-auto grid-cols-2 bg-muted">
                  <TabsTrigger value="marketplace" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Marketplace
                  </TabsTrigger>
                  <TabsTrigger value="wallet" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    My NFTs
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  >
                    {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <Card className="mb-6 bg-muted/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="search" className="text-sm font-medium">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search NFTs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {activeTab === 'marketplace' && (
                      <>
                        <div>
                          <Label className="text-sm font-medium">Min Price (SOL)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={priceFilter.min}
                            onChange={(e) => setPriceFilter(prev => ({ ...prev, min: e.target.value }))}
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Max Price (SOL)</Label>
                          <Input
                            type="number"
                            placeholder="∞"
                            value={priceFilter.max}
                            onChange={(e) => setPriceFilter(prev => ({ ...prev, max: e.target.value }))}
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <Label className="text-sm font-medium">Rarity</Label>
                      <select
                        value={rarityFilter}
                        onChange={(e) => setRarityFilter(e.target.value)}
                        className="w-full p-2 border border-input bg-background rounded-md"
                      >
                        <option value="">All Rarities</option>
                        <option value="Common">Common</option>
                        <option value="Rare">Rare</option>
                        <option value="Legendary">Legendary</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <TabsContent value="marketplace">
                {filteredNfts.length > 0 ? (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {filteredNfts.map((nft) => (
                      <NFTCard key={nft.mint} nft={nft} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No NFTs Found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="wallet">
                {filteredNfts.length > 0 ? (
                  <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {filteredNfts.map((nft) => (
                      <NFTCard key={nft.mint} nft={nft} isOwned />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No NFTs Found</h3>
                    <p className="text-muted-foreground">Your NFT collection will appear here</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Wallet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to view and manage your NFT collection
              </p>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}