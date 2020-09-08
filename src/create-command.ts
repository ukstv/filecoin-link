import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import IdentityWallet from "identity-wallet";
import { LocalFilecoinProvider } from "@ukstv/local-filecoin-provider";
import { AccountID } from "caip";
import * as blockchainUtils from "@ukstv/3id-blockchain-utils";

export async function createCommand(
  seed: string,
  privateKey: string,
  network: string
) {
  const client = new CeramicClient();
  try {
    const identityWallet = await IdentityWallet.create({
      getPermission: async (rec) => (rec.payload.paths as unknown) as string[],
      useThreeIdProv: true,
      seed: seed,
      ceramic: client,
    });

    const isTestnet = network !== "f";
    const provider = new LocalFilecoinProvider(privateKey, isTestnet);
    const address = (await provider.getAccounts())[0];
    const caipNetwork = isTestnet ? "fil:t" : "fil:f";
    const account = new AccountID(`${address}@${caipNetwork}`);
    const did = identityWallet.DID;
    const proof = await blockchainUtils.createLink(did, account, provider);
    await identityWallet.idx.load();
    await identityWallet.idx.addAccountLink(proof);
    console.log(`Linked ${address} to ${did}`);
  } finally {
    await client.close();
  }
}
