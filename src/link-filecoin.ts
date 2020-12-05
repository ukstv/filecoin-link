import { AccountID } from "caip";
import type { LinkProof } from "3id-blockchain-utils";
import * as blockchainUtils from "3id-blockchain-utils";
import { CeramicApi, Doctype } from "@ceramicnetwork/common";
import { WalletSubProvider } from "@glif/filecoin-wallet-provider";

export async function linkFilecoin(
  ceramic: CeramicApi,
  did: string,
  filecoinAddress: string,
  provider: WalletSubProvider
): Promise<[Doctype, LinkProof]> {
  const isTestnet = filecoinAddress.startsWith("t");
  const caipNetwork = isTestnet ? "fil:t" : "fil:f";
  const account = new AccountID(`${filecoinAddress}@${caipNetwork}`);
  const linkProof = await blockchainUtils.createLink(did, account, provider);
  const accountLinkDocument = await ceramic.createDocument(
    "caip10-link",
    { metadata: { controllers: [linkProof.account] } },
    { publish: false, anchor: false }
  );
  await accountLinkDocument.change(
    { content: linkProof },
    { anchor: true, publish: true }
  );
  return [accountLinkDocument, linkProof];
}
