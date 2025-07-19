/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/marketplace.json`.
 */
export type Marketplace = {
  "address": "broQPt5f3vtMniWxwJLeHK5X56pGgor4Qmpd9jMVLYT",
  "metadata": {
    "name": "marketplace",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "delistNft",
      "discriminator": [
        91,
        249,
        165,
        185,
        22,
        7,
        119,
        176
      ],
      "accounts": [
        {
          "name": "nft",
          "docs": [
            "The NFT mint account being delisted"
          ]
        },
        {
          "name": "listing",
          "docs": [
            "The listing account to be closed",
            "- Must match the PDA derived from marketplace, seller, and NFT",
            "- Closed and rent refunded to seller after successful delisting"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "marketplace"
              },
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ]
          }
        },
        {
          "name": "listingTokenAccount",
          "docs": [
            "Token account holding the NFT during listing",
            "- Owned by the listing PDA",
            "- Will be emptied during delisting"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "listing"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "seller",
          "docs": [
            "The seller who originally listed the NFT",
            "- Must be the same as the seller in the listing",
            "- Receives the NFT back and rent refund"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "sellerTokenAccount",
          "docs": [
            "The seller's token account to receive the NFT",
            "- Must be owned by the seller",
            "- Will receive the NFT back"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "marketplace",
          "docs": [
            "The marketplace state account for validation"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116,
                  112,
                  108,
                  97,
                  99,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "Required programs"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "initializeMarketplace",
      "discriminator": [
        47,
        81,
        64,
        0,
        96,
        56,
        105,
        7
      ],
      "accounts": [
        {
          "name": "admin",
          "docs": [
            "The admin account that will manage the marketplace",
            "Must be mutable to pay for account creation"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "marketplace",
          "docs": [
            "The marketplace state account",
            "- Initialized with a PDA using \"marketplace\" seed",
            "- Stores admin pubkey, fee percentage, and bump values"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116,
                  112,
                  108,
                  97,
                  99,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "docs": [
            "Treasury account for collecting marketplace fees",
            "- Uses PDA with \"treasury\" seed and marketplace key",
            "- Not initialized here, just validated"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "marketplace"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "Required system program for account creation"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "feePercentage",
          "type": "u8"
        }
      ]
    },
    {
      "name": "listNft",
      "discriminator": [
        88,
        221,
        93,
        166,
        63,
        220,
        106,
        232
      ],
      "accounts": [
        {
          "name": "nft",
          "docs": [
            "The NFT mint account to be listed"
          ]
        },
        {
          "name": "listing",
          "docs": [
            "The listing state account",
            "- Stores seller, mint, price, and status information",
            "- Uses PDA with marketplace, seller, and NFT mint as seeds"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "marketplace"
              },
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ]
          }
        },
        {
          "name": "listingTokenAccount",
          "docs": [
            "Token account that will hold the NFT during listing",
            "- Owned by the listing PDA for security",
            "- Created as associated token account"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "listing"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "seller",
          "docs": [
            "The seller who owns the NFT and is creating the listing"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "sellerTokenAccount",
          "docs": [
            "The seller's token account containing the NFT",
            "- Must be owned by the seller",
            "- Must have the NFT to be listed"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "marketplace",
          "docs": [
            "The marketplace state account",
            "- Validates this is the correct marketplace instance"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116,
                  112,
                  108,
                  97,
                  99,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "collectionMint",
          "docs": [
            "The collection mint that this NFT belongs to",
            "- Used for collection verification"
          ]
        },
        {
          "name": "metadata",
          "docs": [
            "The metadata account for the NFT",
            "- Contains collection information and verification status",
            "- Must be from a verified collection"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "metadataProgram"
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ],
            "program": {
              "kind": "account",
              "path": "metadataProgram"
            }
          }
        },
        {
          "name": "masterEdition",
          "docs": [
            "The master edition account for the NFT",
            "- Proves this is a valid NFT (not just a token)"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "metadataProgram"
              },
              {
                "kind": "account",
                "path": "nft"
              },
              {
                "kind": "const",
                "value": [
                  101,
                  100,
                  105,
                  116,
                  105,
                  111,
                  110
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "metadataProgram"
            }
          }
        },
        {
          "name": "metadataProgram",
          "docs": [
            "Required programs for the instruction"
          ],
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "purchaseNft",
      "discriminator": [
        217,
        35,
        113,
        146,
        250,
        29,
        8,
        209
      ],
      "accounts": [
        {
          "name": "nft",
          "docs": [
            "The NFT mint account being purchased"
          ]
        },
        {
          "name": "listing",
          "docs": [
            "The listing account being fulfilled",
            "- Contains price and seller information",
            "- Closed after successful purchase"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "marketplace"
              },
              {
                "kind": "account",
                "path": "seller"
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ]
          }
        },
        {
          "name": "listingTokenAccount",
          "docs": [
            "Token account holding the NFT during listing",
            "- Owned by the listing PDA",
            "- NFT transferred from here to buyer"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "listing"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "buyer",
          "docs": [
            "The buyer purchasing the NFT",
            "- Pays for the NFT plus marketplace fees",
            "- Receives the NFT in their token account"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "buyerTokenAccount",
          "docs": [
            "The buyer's token account to receive the NFT",
            "- Must be owned by the buyer",
            "- Will receive the purchased NFT"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nft"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "seller",
          "docs": [
            "The seller who listed the NFT",
            "- Receives payment minus marketplace fees",
            "- Validated against the listing's seller field"
          ],
          "writable": true
        },
        {
          "name": "marketplace",
          "docs": [
            "The marketplace state account",
            "- Contains fee percentage for calculations"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116,
                  112,
                  108,
                  97,
                  99,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "docs": [
            "Treasury account for collecting marketplace fees",
            "- Receives the calculated fee percentage"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "marketplace"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "Required programs"
          ],
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "listing",
      "discriminator": [
        218,
        32,
        50,
        73,
        43,
        134,
        26,
        58
      ]
    },
    {
      "name": "marketplace",
      "discriminator": [
        70,
        222,
        41,
        62,
        78,
        3,
        32,
        174
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidFeePercentage",
      "msg": "Invalid fee percentage"
    },
    {
      "code": 6001,
      "name": "invalidPrice",
      "msg": "Invalid price"
    },
    {
      "code": 6002,
      "name": "listingNotActive",
      "msg": "Listing is not active"
    },
    {
      "code": 6003,
      "name": "mathOverflow",
      "msg": "Math overflow"
    }
  ],
  "types": [
    {
      "name": "listing",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seller",
            "docs": [
              "The seller's public key who listed the NFT"
            ],
            "type": "pubkey"
          },
          {
            "name": "mint",
            "docs": [
              "The mint address of the NFT being sold"
            ],
            "type": "pubkey"
          },
          {
            "name": "price",
            "docs": [
              "The listing price in lamports"
            ],
            "type": "u64"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed for this listing account",
              "Used for deterministic address generation"
            ],
            "type": "u8"
          },
          {
            "name": "isActive",
            "docs": [
              "Whether this listing is currently active",
              "Set to false when purchased or delisted"
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "marketplace",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "The admin public key who can manage the marketplace"
            ],
            "type": "pubkey"
          },
          {
            "name": "feePercentage",
            "docs": [
              "Fee percentage charged on each sale (0-100)",
              "This percentage is taken from the sale price and sent to treasury"
            ],
            "type": "u8"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump seed for the marketplace account",
              "Used for deterministic address generation"
            ],
            "type": "u8"
          },
          {
            "name": "treasuryBump",
            "docs": [
              "PDA bump seed for the treasury account",
              "Used for deterministic address generation of the treasury"
            ],
            "type": "u8"
          }
        ]
      }
    }
  ]
};
