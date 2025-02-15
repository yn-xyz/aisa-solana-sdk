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
                    name: "paymentInterval";
                    type: "u64";
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
            name: "updatePaymentInterval";
            discriminator: [33, 189, 150, 61, 234, 89, 241, 114];
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
                    address: "11111111111111111111111111111111";
                }
            ];
            args: [
                {
                    name: "paymentInterval";
                    type: "u64";
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
        }
    ];
    types: [
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
                        name: "lastPaymentTimestamp";
                        type: "u64";
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
                        name: "paymentInterval";
                        type: "u64";
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
