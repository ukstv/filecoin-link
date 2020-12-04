import CeramicClient from "@ceramicnetwork/http-client";
import ThreeProvider from "3id-did-provider";
import * as idxTools from "@ceramicstudio/idx-tools";
import { IDX } from "@ceramicstudio/idx";
import { linkFilecoin } from "../link-filecoin";
import { Network } from "@glif/filecoin-address";

export async function createCommand(
  seed: Uint8Array,
  privateKey: string,
  network: Network,
  ceramicEndpoint?: string
) {
  const ceramic = new CeramicClient(ceramicEndpoint);
  const identityWallet = await ThreeProvider.create({
    getPermission: async (rec) => (rec.payload.paths as unknown) as string[],
    seed: seed,
    ceramic: ceramic,
  });
  const { definitions } = await idxTools.publishIDXConfig(ceramic);
  await ceramic.setDIDProvider(identityWallet.getDidProvider());
  const idx = new IDX({ ceramic });
  await idx.authenticate();
  try {
    const did = identityWallet.id;
    const [accountLinkDocument, linkProof] = await linkFilecoin(
      ceramic,
      did,
      network,
      privateKey
    );
    await idx.set(definitions.cryptoAccounts, {
      [linkProof.account]: accountLinkDocument.id,
    });
    console.log(`Linked ${linkProof.account} to ${did}`);
  } finally {
    await ceramic.close();
  }
}
