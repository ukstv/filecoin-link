import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import IdentityWallet from "identity-wallet";
import { LocalFilecoinProvider } from "@ukstv/local-filecoin-provider";
import { AccountID } from "caip";
import * as blockchainUtils from "@ukstv/3id-blockchain-utils";
import { schemasList, publishSchemas } from "@ceramicstudio/idx-schemas";
import { IDX } from "@ukstv/ceramicstudio-idx";

export async function createCommand(
  seed: string,
  privateKey: string,
  network: string
) {
  const ceramic = new CeramicClient();
  const identityWallet = await IdentityWallet.create({
    getPermission: async (rec) => (rec.payload.paths as unknown) as string[],
    useThreeIdProv: true,
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
    const isTestnet = network !== "f";
    const provider = new LocalFilecoinProvider(privateKey, isTestnet);
    const address = (await provider.getAccounts())[0];
    const caipNetwork = isTestnet ? "fil:t" : "fil:f";
    const account = new AccountID(`${address}@${caipNetwork}`);
    const did = identityWallet.DID;
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
    const idxMapped = await idx.getIDXDocID(idx.did.id);
    if (!idxMapped) {
      console.log("idx is not linked to DID. Linking idx...");
      const docId = idx.did.id.replace(/^did:3:/, "ceramic://");
      const rootIndexId = (await idx._rootIndex._getOrCreateOwnDoc()).id;
      const threeIdDocument = await ceramic.loadDocument(docId);
      await threeIdDocument.change({
        content: {
          ...threeIdDocument.content,
          idx: rootIndexId,
        },
      });
    }
    console.log(`Linked ${address} to ${did}`);
  } finally {
    await ceramic.close();
  }
}
