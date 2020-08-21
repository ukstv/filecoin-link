declare module "@zondax/filecoin-signing-tools" {
  export interface ExtendedKey {
    address: string;
    public_raw: Uint8Array;
    private_raw: Uint8Array;
    public_hexstring: Uint8Array;
    private_hexstring: Uint8Array;
    public_base64: Uint8Array;
    private_base64: Uint8Array;
  }

  export function keyRecover(
    privateKey: string,
    testnet?: boolean
  ): ExtendedKey;

  export function transactionSign(message: any, privateKeyHex: Uint8Array): any;
  export function verifySignature(signature: any, message: any): any;
  export function transactionSerialize(message: any): any;
}
