import { LocalFilecoinProvider } from "@ukstv/local-filecoin-provider";
import { AccountID } from "caip";
import * as blockchainUtils from "@ukstv/3id-blockchain-utils";
import { CeramicApi, Doctype } from "@ceramicnetwork/ceramic-common";
import { LinkProof } from "@ukstv/3id-blockchain-utils";

export async function linkFilecoin(
  ceramic: CeramicApi,
  did: string,
  network: string,
  privateKey: string
): Promise<[Doctype, LinkProof]> {
  const isTestnet = network !== "f";
  const provider = new LocalFilecoinProvider(privateKey, isTestnet);
  const address = (await provider.getAccounts())[0];
  const caipNetwork = isTestnet ? "fil:t" : "fil:f";
  const account = new AccountID(`${address}@${caipNetwork}`);
  const linkProof = await blockchainUtils.createLink(did, account, provider);
  const accountLinkDocument = await ceramic.createDocument(
    "account-link",
    { metadata: { owners: [linkProof.account] } },
    { applyOnly: true }
  );
  await accountLinkDocument.change({ content: did });
  return [accountLinkDocument, linkProof];
}
