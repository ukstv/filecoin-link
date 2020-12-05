import CeramicClient from "@ceramicnetwork/http-client";
import { linkFilecoin } from "../link-filecoin";
import { Network } from "@glif/filecoin-address";
import { LocalManagedProvider } from "@glif/local-managed-provider";

export async function createRecordCommand(
  did: string,
  privateKey: string,
  network: Network,
  ceramicEndpoint?: string
) {
  const ceramic = new CeramicClient(ceramicEndpoint);
  const provider = new LocalManagedProvider(privateKey, network);
  const filecoinAddress = (await provider.getAccounts())[0];
  const [accountLinkDocument] = await linkFilecoin(
    ceramic,
    did,
    filecoinAddress,
    provider
  );
  console.log(`Account link created as ${accountLinkDocument.id}`);
}
