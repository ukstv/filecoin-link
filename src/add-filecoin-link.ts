import { WalletSubProvider } from "@glif/filecoin-wallet-provider";
import { Network } from "@glif/filecoin-address";
import { IDX } from "@ceramicstudio/idx";
import { linkFilecoin } from "./link-filecoin";
import * as idxTools from "@ceramicstudio/idx-tools";
import type {LinkProof} from "3id-blockchain-utils";

export async function addFilecoinLink(idx: IDX, provider: WalletSubProvider): Promise<LinkProof> {
  const ceramic = idx.ceramic;
  const { definitions } = await idxTools.publishIDXConfig(ceramic);
  const filecoinAddress = (await provider.getAccounts(0, 1, Network.MAIN))[0];
  const did = idx.did.id;
  const [accountLinkDocument, linkProof] = await linkFilecoin(
    ceramic,
    did,
    filecoinAddress,
    provider
  );
  await idx.set(definitions.cryptoAccounts, {
    [linkProof.account]: accountLinkDocument.id.toUrl(),
  });
  await idx.getIDXContent(did);
  return linkProof;
}
