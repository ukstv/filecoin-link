import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import IdentityWallet from "identity-wallet";
import { schemasList, publishSchemas } from "@ceramicstudio/idx-schemas";
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
  await ceramic.setDIDProvider(identityWallet.getDidProvider());
  const schemas = await publishSchemas({ ceramic, schemas: schemasList });
  const idx = new IDX({ ceramic, schemas });
  await idx.authenticate();
  const accountLinksDefinition = await idx.createDefinition({
    name: "Account Links",
    schema: schemas.CryptoAccountLinks,
  });

  try {
    const did = identityWallet.id;
    const [accountLinkDocument, linkProof] = await linkFilecoin(
      ceramic,
      did,
      network,
      privateKey
    );
    await idx.set(accountLinksDefinition, {
      [linkProof.account]: accountLinkDocument.id,
    });
    console.log(`Linked ${linkProof.account} to ${did}`);
  } finally {
    await ceramic.close();
  }
}
