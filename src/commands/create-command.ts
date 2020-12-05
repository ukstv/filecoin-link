import CeramicClient from "@ceramicnetwork/http-client";
import ThreeProvider from "3id-did-provider";
import { IDX } from "@ceramicstudio/idx";
import { Network } from "@glif/filecoin-address";
import { LocalManagedProvider } from "@glif/local-managed-provider";
import { addFilecoinLink } from "../add-filecoin-link";

export async function createCommand(
  seed: Uint8Array,
  privateKey: string,
  network: Network,
  ceramicEndpoint?: string
) {
  const ceramic = new CeramicClient(ceramicEndpoint);
  const identityWallet = await ThreeProvider.create({
    getPermission: async (rec) => (rec.payload.paths as unknown) as string[],
    seed: seed,
    ceramic: ceramic,
  });
  await ceramic.setDIDProvider(identityWallet.getDidProvider());
  const idx = new IDX({ ceramic });
  await idx.authenticate();
  try {
    const provider = new LocalManagedProvider(privateKey, network);
    const linkProof = await addFilecoinLink(idx, provider);
    console.log(`Linked ${linkProof.account} to ${idx.did.id}`);
  } finally {
    await ceramic.close();
  }
}
