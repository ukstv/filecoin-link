import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import IdentityWallet from "identity-wallet";
import { LocalFilecoinProvider } from "@ukstv/local-filecoin-provider";
import { AccountID } from "caip";
import * as blockchainUtils from "@ukstv/3id-blockchain-utils";
import { schemasList, publishSchemas } from "@ceramicstudio/idx-schemas";
import { IDX } from "@ceramicstudio/idx";

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
  console.log('s', schemas)
  const idx = new IDX({ ceramic, schemas });
  await idx.authenticate();
  const accountLinksDefinition = await idx.createDefinition({
    name: "Account Links",
    schema: schemas.CryptoAccountLinks,
  });

  try {
    const isTestnet = network !== "f";
    const provider = new LocalFilecoinProvider(privateKey, isTestnet);
    const address = (await provider.getAccounts())[0];
    const caipNetwork = isTestnet ? "fil:t" : "fil:f";
    const account = new AccountID(`${address}@${caipNetwork}`);
    const did = identityWallet.id;
    const linkProof = await blockchainUtils.createLink(did, account, provider);
    const accountLinkDocument = await ceramic.createDocument(
      "account-link",
      { metadata: { owners: [linkProof.account] } },
      { applyOnly: true }
    );
    await accountLinkDocument.change({ content: linkProof });
    await idx.set(accountLinksDefinition, {
      [linkProof.account]: accountLinkDocument.id,
    });
    console.log(`Linked ${address} to ${did}`);
  } finally {
    await ceramic.close();
  }
}
