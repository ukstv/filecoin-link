import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import IdentityWallet from "identity-wallet";
import * as idxTools from "@ceramicstudio/idx-tools";
import { IDX } from "@ceramicstudio/idx";
import { linkFilecoin } from "../link-filecoin";

export async function createCommand(
  seed: string,
  privateKey: string,
  network: string
) {
  const ceramic = new CeramicClient();
  const identityWallet = await IdentityWallet.create({
    getPermission: async (rec) => (rec.payload.paths as unknown) as string[],
    seed: seed,
    ceramic: ceramic,
  });
  const { definitions } = await idxTools.publishIDXConfig(ceramic);
  await ceramic.setDIDProvider(identityWallet.getDidProvider());
  const idx = new IDX({ ceramic, definitions });
  await idx.authenticate();
  try {
    const did = identityWallet.id;
    const [accountLinkDocument, linkProof] = await linkFilecoin(
      ceramic,
      did,
      network,
      privateKey
    );
    await idx.set(definitions.cryptoAccountLinks, {
      [linkProof.account]: accountLinkDocument.id,
    });
    console.log(`Linked ${linkProof.account} to ${did}`);
  } finally {
    await ceramic.close();
  }
}
