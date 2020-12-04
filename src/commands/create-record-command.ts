import CeramicClient from "@ceramicnetwork/http-client";
import { linkFilecoin } from "../link-filecoin";
import { Network } from "@glif/filecoin-address";

export async function createRecordCommand(
  did: string,
  privateKey: string,
  network: Network,
  ceramicEndpoint?: string
) {
  const ceramic = new CeramicClient(ceramicEndpoint);
  const [accountLinkDocument] = await linkFilecoin(
    ceramic,
    did,
    network,
    privateKey
  );
  console.log(`Account link created as ${accountLinkDocument.id}`);
}
