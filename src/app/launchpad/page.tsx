'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  generateSigner,
  percentAmount
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'
import { Check, ImageIcon, Loader2, Rocket, Sparkles, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { ChangeEvent, useCallback, useState } from 'react'
import { toast } from 'sonner'

interface Attribute {
  trait_type: string
  value: string
}

interface Metadata {
  name: string
  description: string
  image: string
  attributes: Attribute[]
  properties: {
    files: { uri: string; type: string }[]
  }
}

// Initialize UMI
const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())

export default function LaunchpadPage() {
  const { publicKey: walletPublicKey, wallet } = useWallet()
  const [step, setStep] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)

  const [formData, setFormData] = useState<{
    name: string
    description: string
    image: File | null
    attributes: Attribute[]
  }>({
    name: '',
    description: '',
    image: null,
    attributes: [],
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [attribute, setAttribute] = useState<Attribute>({ trait_type: '', value: '' })
  const [mintAddress, setMintAddress] = useState<string>('')

  // Pinata API keys
  const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY ?? ''
  const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY ?? ''

  // Image upload handlers
  const handleImageUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result
        if (typeof result === 'string') {
          setImagePreview(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }, [])


  const addAttribute = () => {
    if (attribute.trait_type && attribute.value) {
      setFormData(prev => ({
        ...prev,
        attributes: [...prev.attributes, { ...attribute }]
      }))
      setAttribute({ trait_type: '', value: '' })
    }
  }

  const removeAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }))
  }

  // Upload file or metadata JSON to Pinata
  const uploadToPinata = async (file: File | Metadata, isMetadata = false): Promise<string> => {
    const formData = new FormData()

    if (isMetadata) {
      const blob = new Blob([JSON.stringify(file)], { type: 'application/json' })
      formData.append('file', blob, 'metadata.json')
    } else if (file instanceof File) {
      formData.append('file', file)
    } else {
      throw new Error('Invalid file input')
    }

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Pinata upload failed: ${errorData.error?.reason || response.statusText}`)
      }

      const data = await response.json()
      return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`
    } catch (err) {
      console.error("Pinata upload error:", err);
      toast.error(`Failed to upload to Pinata: ${err instanceof Error ? err.message : String(err)}`);
      throw err;
    }
  }

  const createAndMintNFT = async () => {
    if (!walletPublicKey || !wallet) {
      toast.error('Please connect your wallet first.')
      return
    }

    if (!formData.image) {
      toast.error('Please upload an image for your NFT.')
      return
    }

    if (!formData.name.trim()) {
      toast.error('Please provide a name for your NFT.')
      return
    }


    try {
      setLoading(true)
      setSuccess(false)
      setStep(1)

      toast.info('Initializing UMI...')
      umi.use(walletAdapterIdentity(wallet.adapter))

      setStep(3)
      toast.info('Uploading NFT image to Pinata...')
      const nftImageUri = await uploadToPinata(formData.image)

      toast.info('Uploading NFT metadata to Pinata...')
      const nftMetadata = {
        name: formData.name,
        description: formData.description || '',
        image: nftImageUri,
        attributes: formData.attributes || [],
      }
      const nftMetadataUri = await uploadToPinata(
        new File([JSON.stringify(nftMetadata)], 'metadata.json', { type: 'application/json' }),
      )

      setStep(4)
      const nftSigner = generateSigner(umi)

      toast.info('Creating NFT onchain...')
      await createNft(umi, {
        mint: nftSigner,
        name: formData.name,
        uri: nftMetadataUri,
        sellerFeeBasisPoints: percentAmount(5),
      }).sendAndConfirm(umi)

      setMintAddress(nftSigner.publicKey.toString())
      setStep(5)
      setSuccess(true)

      toast.success('NFT created successfully.', {
        description: `Mint Address: ${nftSigner.publicKey.toString()}`,
        duration: 8000,
      })
    } catch (err) {
      console.error('Error creating NFT:', err)
      toast.error('Failed to create NFT.', {
        description: err instanceof Error ? err.message : 'Unknown error',
        duration: 5000,
      })
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', image: null, attributes: [] })
    setImagePreview('')
    setStep(1)
    setSuccess(false)
    setMintAddress('')
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-primary-foreground px-6 py-3 rounded-full mb-6 shadow-lg">
            <Rocket className="h-5 w-5 animate-bounce" />
            <span className="font-bold">NFT Launchpad</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Create Your NFT
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Transform your creativity into unique digital assets. Upload your artwork, add metadata, and mint your NFT directly to your wallet on Solana devnet.
          </p>
        </div>

        {success ? (
          // Success State
          <Card className="rounded-3xl shadow-2xl p-6 sm:p-8 text-center bg-card">
            <CardContent className="p-0">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-4">NFT Created Successfully!</h2>
              <p className="text-muted-foreground mb-6">Your NFT has been minted and is now in your wallet.</p>
              <div className="space-y-4">
                <div className="bg-muted rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">NFT Mint Address:</p>
                  <p className="font-mono text-sm break-all text-foreground">{mintAddress}</p>
                </div>
              </div>
              <Button
                onClick={resetForm}
                className="mt-6 w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 text-primary-foreground px-8 py-3 rounded-full font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
              >
                Create Another NFT
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Main Form
          <Card className="rounded-3xl shadow-2xl overflow-hidden bg-card">
            {/* Progress Bar */}
            <div className="bg-card p-4 border-b border-border">
              <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
                <span>Step {step} of 7</span>
                <span>{loading ? 'Processing...' : 'Ready'}</span>
              </div>
              <Progress
                value={(step / 7) * 100}
                className="w-full h-2 mt-3 bg-muted"
              />
            </div>

            <CardContent className="p-4 sm:p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column - Form */}
                <div className="space-y-6">

                  {/* Image Upload */}
                  <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-foreground mb-2">
                      Upload NFT Image <span className="text-destructive">*</span>
                    </label>
                    <div className="border-2 border-dashed border-input rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={loading}
                      />
                      <label htmlFor="image-upload" className="flex flex-col items-center space-y-2">
                        <Upload className="h-8 w-8 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          Drop your image here or click to browse
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* NFT Name */}
                  <div>
                    <label htmlFor="nft-name" className="block text-sm font-medium text-foreground mb-2">
                      NFT Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="nft-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter NFT name"
                      disabled={loading}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="nft-description" className="block text-sm font-medium text-foreground mb-2">
                      Description
                    </label>
                    <Textarea
                      id="nft-description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      placeholder="Describe your NFT"
                      disabled={loading}
                    />
                  </div>

                  {/* Attributes */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Attributes (Optional)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-2">
                      <Input
                        type="text"
                        value={attribute.trait_type}
                        onChange={(e) => setAttribute(prev => ({ ...prev, trait_type: e.target.value }))}
                        className="flex-1"
                        placeholder="Trait type"
                        disabled={loading}
                      />
                      <Input
                        type="text"
                        value={attribute.value}
                        onChange={(e) => setAttribute(prev => ({ ...prev, value: e.target.value }))}
                        className="flex-1"
                        placeholder="Value"
                        disabled={loading}
                      />
                      <Button
                        onClick={addAttribute}
                        className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={loading || !attribute.trait_type || !attribute.value}
                      >
                        Add
                      </Button>
                    </div>

                    {formData.attributes.length > 0 && (
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                        {formData.attributes.map((attr, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-lg">
                            <Badge variant="secondary" className="mr-2">
                              {attr.trait_type}
                            </Badge>
                            <span className="text-sm text-foreground">{attr.value}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAttribute(index)}
                              className="text-destructive hover:text-destructive/80"
                              disabled={loading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Preview */}
                <div className="space-y-6">
                  {/* NFT Preview */}
                  <Card className="bg-muted p-6 rounded-xl">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className="text-lg font-semibold text-foreground">NFT Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={200}
                          height={200}
                          className="object-cover rounded-lg mb-4 border border-border"
                        />
                      ) : (
                        <div className="w-full h-64 bg-secondary rounded-lg flex items-center justify-center mb-4 border border-border">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-foreground text-xl">
                          {formData.name || 'NFT Name'}
                        </h4>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        {formData.description || 'NFT Description'}
                      </p>

                      {formData.attributes.length > 0 && (
                        <div className="space-y-1">
                          <h5 className="font-medium text-foreground mb-2">Attributes:</h5>
                          <div className="flex flex-wrap gap-2">
                            {formData.attributes.map((attr, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <span className="font-medium mr-1">{attr.trait_type}:</span> {attr.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Mint Button */}
                  <Button
                    onClick={createAndMintNFT}
                    disabled={loading || !formData.name.trim() || !formData.image || !walletPublicKey}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-primary-foreground py-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.01] flex items-center justify-center space-x-3 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Creating NFT...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-6 w-6" />
                        <span>Create & Mint NFT</span>
                      </>
                    )}
                  </Button>

                  {!walletPublicKey && (
                    <p className="text-sm text-center text-muted-foreground">
                      Please connect your wallet to create an NFT.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
