import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import { linkFilecoin } from "../link-filecoin";

export async function createRecordCommand(
  did: string,
  network: string,
  privateKey: string,
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
