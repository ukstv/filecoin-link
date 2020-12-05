import { LocalManagedProvider } from "@glif/local-managed-provider";
import { AccountID } from "caip";
import type { LinkProof } from "3id-blockchain-utils";
import * as blockchainUtils from "3id-blockchain-utils";
import { CeramicApi, Doctype } from "@ceramicnetwork/common";
import { Network } from "@glif/filecoin-address";

export async function linkFilecoin(
  ceramic: CeramicApi,
  did: string,
  network: Network,
  privateKey: string
): Promise<[Doctype, LinkProof]> {
  const provider = new LocalManagedProvider(privateKey, network);
  const address = (await provider.getAccounts())[0];
  const isTestnet = network !== Network.TEST;
  const caipNetwork = isTestnet ? "fil:t" : "fil:f";
  const account = new AccountID(`${address}@${caipNetwork}`);
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
