export interface LinkProof {
  version: number;
  message: string;
  signature: string;
  account: string;
  did?: string;
  timestamp?: number;
  address?: string;
  type?: string;
  chainId?: number;
}
