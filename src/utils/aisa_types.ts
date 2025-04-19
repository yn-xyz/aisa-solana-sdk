/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/aisa_contracts.json`.
 */
export type AisaContracts = {
  address: "G34e7zJuRne2pfDHh9YayixM2rJFdwV624NUzbj9FRR5";
  metadata: {
    name: "aisaContracts";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "createMainAccount";
      discriminator: [0, 230, 26, 245, 89, 244, 117, 160];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "mainAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 97, 105, 110, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "arg";
                path: "uuid";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "uuid";
          type: {
            array: ["u8", 20];
          };
        },
        {
          name: "globalWhitelistedPayees";
          type: {
            vec: "pubkey";
          };
        },
        {
          name: "globalWhitelistedTokens";
          type: {
            vec: "pubkey";
          };
        }
      ];
    },
    {
      name: "createSubAccount";
      discriminator: [230, 148, 237, 115, 126, 55, 226, 172];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "whitelistedPayees";
          type: {
            vec: "pubkey";
          };
        },
        {
          name: "whitelistedTokens";
          type: {
            vec: "pubkey";
          };
        },
        {
          name: "maxPerPayment";
          type: "u64";
        },
        {
          name: "paymentCount";
          type: "u32";
        },
        {
          name: "spendCap";
          type: {
            defined: {
              name: "spendCap";
            };
          };
        }
      ];
    },
    {
      name: "decreaseSubAccountAllowance";
      discriminator: [33, 221, 31, 108, 127, 212, 13, 78];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "ownerTokenAccount";
          writable: true;
        },
        {
          name: "saTokenAccount";
          writable: true;
        },
        {
          name: "tokenMint";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "paymentCount";
          type: "u32";
        }
      ];
    },
    {
      name: "increaseSubAccountAllowance";
      discriminator: [185, 17, 213, 76, 158, 229, 210, 197];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "ownerTokenAccount";
          writable: true;
        },
        {
          name: "saTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "subAccount";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
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
              ];
            };
          };
        },
        {
          name: "tokenMint";
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "paymentCount";
          type: "u32";
        }
      ];
    },
    {
      name: "paymentRequest";
      discriminator: [52, 4, 28, 75, 173, 183, 120, 27];
      accounts: [
        {
          name: "agent";
          signer: true;
        },
        {
          name: "payee";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "saTokenAccount";
          writable: true;
        },
        {
          name: "payeeTokenAccount";
          writable: true;
        },
        {
          name: "tokenMint";
        },
        {
          name: "tokenProgram";
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "updateAndRefreshSpendCap";
      discriminator: [43, 2, 161, 70, 220, 23, 12, 52];
      accounts: [
        {
          name: "owner";
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "updatedSpendCap";
          type: {
            defined: {
              name: "spendCap";
            };
          };
        }
      ];
    },
    {
      name: "updateGlobalWhitelistedPayees";
      discriminator: [223, 238, 153, 206, 225, 143, 209, 38];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "mainAccount";
          writable: true;
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "globalWhitelistedPayees";
          type: {
            vec: "pubkey";
          };
        }
      ];
    },
    {
      name: "updateGlobalWhitelistedTokens";
      discriminator: [6, 44, 252, 164, 245, 179, 137, 204];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "mainAccount";
          writable: true;
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "globalWhitelistedTokens";
          type: {
            vec: "pubkey";
          };
        }
      ];
    },
    {
      name: "updateMaxPerPayment";
      discriminator: [149, 43, 130, 173, 148, 78, 36, 90];
      accounts: [
        {
          name: "owner";
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "maxPerPayment";
          type: "u64";
        }
      ];
    },
    {
      name: "updatePaymentCount";
      discriminator: [6, 237, 177, 163, 218, 64, 222, 136];
      accounts: [
        {
          name: "owner";
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "paymentCount";
          type: "u32";
        }
      ];
    },
    {
      name: "updateSpendCapAmount";
      discriminator: [251, 39, 213, 84, 31, 183, 13, 204];
      accounts: [
        {
          name: "owner";
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "updatedAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "updateSpendCapDuration";
      discriminator: [169, 46, 226, 124, 191, 215, 16, 205];
      accounts: [
        {
          name: "owner";
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "updatedDuration";
          type: "u32";
        },
        {
          name: "updatedUnit";
          type: {
            defined: {
              name: "timeUnit";
            };
          };
        }
      ];
    },
    {
      name: "updateWhitelistedPayees";
      discriminator: [114, 245, 133, 0, 131, 136, 86, 39];
      accounts: [
        {
          name: "owner";
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "whitelistedPayees";
          type: {
            vec: "pubkey";
          };
        }
      ];
    },
    {
      name: "updateWhitelistedTokens";
      discriminator: [46, 21, 183, 72, 106, 199, 74, 149];
      accounts: [
        {
          name: "owner";
          signer: true;
        },
        {
          name: "agent";
        },
        {
          name: "mainAccount";
        },
        {
          name: "subAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [115, 117, 98, 95, 97, 99, 99, 111, 117, 110, 116];
              },
              {
                kind: "account";
                path: "mainAccount";
              },
              {
                kind: "account";
                path: "agent";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          optional: true;
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "whitelistedTokens";
          type: {
            vec: "pubkey";
          };
        }
      ];
    }
  ];
  accounts: [
    {
      name: "mainAccount";
      discriminator: [167, 91, 121, 143, 195, 6, 65, 138];
    },
    {
      name: "subAccount";
      discriminator: [227, 47, 166, 42, 242, 171, 32, 114];
    }
  ];
  events: [
    {
      name: "createdMainAccount";
      discriminator: [76, 150, 174, 109, 103, 188, 50, 171];
    },
    {
      name: "createdSubAccount";
      discriminator: [204, 130, 190, 26, 93, 157, 53, 182];
    },
    {
      name: "payment";
      discriminator: [173, 15, 163, 37, 17, 144, 245, 221];
    },
    {
      name: "updatedGlobalWhitelistedPayees";
      discriminator: [22, 161, 178, 225, 221, 237, 24, 170];
    },
    {
      name: "updatedGlobalWhitelistedTokens";
      discriminator: [66, 137, 243, 228, 121, 252, 120, 201];
    },
    {
      name: "updatedMaxPerPayment";
      discriminator: [131, 112, 235, 34, 67, 8, 203, 242];
    },
    {
      name: "updatedPaymentCount";
      discriminator: [158, 73, 4, 202, 13, 180, 55, 168];
    },
    {
      name: "updatedSpendCap";
      discriminator: [208, 30, 213, 208, 121, 8, 147, 205];
    },
    {
      name: "updatedSubAccountAllowance";
      discriminator: [167, 211, 199, 50, 153, 176, 149, 166];
    },
    {
      name: "updatedWhitelistedPayees";
      discriminator: [130, 241, 179, 196, 93, 215, 86, 83];
    },
    {
      name: "updatedWhitelistedTokens";
      discriminator: [31, 99, 45, 139, 191, 83, 7, 27];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "notProgramOwnedAccount";
      msg: "Not program owned account";
    },
    {
      code: 6001;
      name: "missingSystemProgram";
      msg: "Missing System Program Account";
    },
    {
      code: 6002;
      name: "invalidSystemProgram";
      msg: "Invalid System Program Account";
    },
    {
      code: 6003;
      name: "duplicatePubkey";
      msg: "Duplicate Pubkey";
    },
    {
      code: 6004;
      name: "incorrectOwner";
      msg: "Incorrect Owner";
    },
    {
      code: 6005;
      name: "notWhitelistedToken";
      msg: "Not Whitelisted Token";
    },
    {
      code: 6006;
      name: "notWhitelistedPayee";
      msg: "Not Whitelisted Payee";
    },
    {
      code: 6007;
      name: "invalidDelay";
      msg: "Invalid delay for interval";
    },
    {
      code: 6008;
      name: "invalidPaymentAmount";
      msg: "Invalid payment amount";
    },
    {
      code: 6009;
      name: "mathOverflow";
      msg: "Math Overflow";
    },
    {
      code: 6010;
      name: "mathUnderflow";
      msg: "Math Underflow";
    },
    {
      code: 6011;
      name: "insufficientPaymentCount";
      msg: "Insufficient Payment Count";
    },
    {
      code: 6012;
      name: "invalidSpendCapPeriod";
      msg: "Spend period too large";
    },
    {
      code: 6013;
      name: "spendAmountExceeded";
      msg: "Spending amount exceeded";
    },
    {
      code: 6014;
      name: "notLimitedSpendCap";
      msg: "Spend cap is not limited";
    }
  ];
  types: [
    {
      name: "createdMainAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mainAccount";
            type: "pubkey";
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "globalWhitelistedPayees";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "globalWhitelistedTokens";
            type: {
              vec: "pubkey";
            };
          }
        ];
      };
    },
    {
      name: "createdSubAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mainAccount";
            type: "pubkey";
          },
          {
            name: "subAccount";
            type: "pubkey";
          },
          {
            name: "maxPerPayment";
            type: "u64";
          },
          {
            name: "paymentCount";
            type: "u32";
          },
          {
            name: "spendCap";
            type: {
              defined: {
                name: "spendCap";
              };
            };
          },
          {
            name: "whitelistedPayees";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "whitelistedTokens";
            type: {
              vec: "pubkey";
            };
          }
        ];
      };
    },
    {
      name: "mainAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "bump";
            type: {
              array: ["u8", 1];
            };
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "globalWhitelistedPayees";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "globalWhitelistedTokens";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "reserved";
            docs: ["Reserved space for upgrade authority"];
            type: {
              array: ["u8", 128];
            };
          }
        ];
      };
    },
    {
      name: "payment";
      type: {
        kind: "struct";
        fields: [
          {
            name: "subAccount";
            type: "pubkey";
          },
          {
            name: "payee";
            type: "pubkey";
          },
          {
            name: "tokenMint";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "lastResetTimestamp";
            type: "u64";
          },
          {
            name: "expendedBudget";
            type: "u64";
          },
          {
            name: "paymentCount";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "spendCap";
      type: {
        kind: "enum";
        variants: [
          {
            name: "none";
          },
          {
            name: "limited";
            fields: [
              {
                name: "duration";
                type: "u32";
              },
              {
                name: "unit";
                type: {
                  defined: {
                    name: "timeUnit";
                  };
                };
              },
              {
                name: "amount";
                type: "u64";
              }
            ];
          }
        ];
      };
    },
    {
      name: "subAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "bump";
            type: {
              array: ["u8", 1];
            };
          },
          {
            name: "maxPerPayment";
            type: "u64";
          },
          {
            name: "paymentCount";
            type: "u32";
          },
          {
            name: "whitelistedPayees";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "whitelistedTokens";
            type: {
              vec: "pubkey";
            };
          },
          {
            name: "spendCap";
            type: {
              defined: {
                name: "spendCap";
              };
            };
          },
          {
            name: "lastResetTimestamp";
            type: "u64";
          },
          {
            name: "expendedBudget";
            type: "u64";
          },
          {
            name: "reserved";
            type: {
              array: ["u8", 128];
            };
          }
        ];
      };
    },
    {
      name: "timeUnit";
      type: {
        kind: "enum";
        variants: [
          {
            name: "second";
          },
          {
            name: "minute";
          },
          {
            name: "hour";
          },
          {
            name: "day";
          },
          {
            name: "week";
          },
          {
            name: "month";
          }
        ];
      };
    },
    {
      name: "updatedGlobalWhitelistedPayees";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mainAccount";
            type: "pubkey";
          },
          {
            name: "globalWhitelistedPayees";
            type: {
              vec: "pubkey";
            };
          }
        ];
      };
    },
    {
      name: "updatedGlobalWhitelistedTokens";
      type: {
        kind: "struct";
        fields: [
          {
            name: "mainAccount";
            type: "pubkey";
          },
          {
            name: "globalWhitelistedTokens";
            type: {
              vec: "pubkey";
            };
          }
        ];
      };
    },
    {
      name: "updatedMaxPerPayment";
      type: {
        kind: "struct";
        fields: [
          {
            name: "subAccount";
            type: "pubkey";
          },
          {
            name: "maxPerPayment";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "updatedPaymentCount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "subAccount";
            type: "pubkey";
          },
          {
            name: "paymentCount";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "updatedSpendCap";
      type: {
        kind: "struct";
        fields: [
          {
            name: "subAccount";
            type: "pubkey";
          },
          {
            name: "spendCap";
            type: {
              defined: {
                name: "spendCap";
              };
            };
          },
          {
            name: "lastResetTimestamp";
            type: "u64";
          },
          {
            name: "expendedBudget";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "updatedSubAccountAllowance";
      type: {
        kind: "struct";
        fields: [
          {
            name: "subAccount";
            type: "pubkey";
          },
          {
            name: "tokenMint";
            type: "pubkey";
          },
          {
            name: "amount";
            type: "u64";
          },
          {
            name: "updatedPaymentCount";
            type: "u32";
          }
        ];
      };
    },
    {
      name: "updatedWhitelistedPayees";
      type: {
        kind: "struct";
        fields: [
          {
            name: "subAccount";
            type: "pubkey";
          },
          {
            name: "whitelistedPayees";
            type: {
              vec: "pubkey";
            };
          }
        ];
      };
    },
    {
      name: "updatedWhitelistedTokens";
      type: {
        kind: "struct";
        fields: [
          {
            name: "subAccount";
            type: "pubkey";
          },
          {
            name: "whitelistedTokens";
            type: {
              vec: "pubkey";
            };
          }
        ];
      };
    }
  ];
  constants: [
    {
      name: "mainAccountSeed";
      type: "string";
      value: '"main_account"';
    }
  ];
};
