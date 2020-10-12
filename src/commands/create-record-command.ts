import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import { linkFilecoin } from "../link-filecoin";

export async function createRecordCommand(
  did: string,
  network: string,
  privateKey: string
) {
  const ceramic = new CeramicClient();
  const [accountLinkDocument] = await linkFilecoin(
    ceramic,
    did,
    network,
    privateKey
  );
  console.log(`Account link created as ${accountLinkDocument.id}`);
}
