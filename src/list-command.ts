import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import { CDefs, ThreeIDX } from "identity-wallet";

export async function listCommand(did: string) {
  const client = new CeramicClient();
  const idx = new ThreeIDX(client);
  await idx.load(did);
  const accountLinksCatalogue = await idx.docs[CDefs.accountLinks];
  const state = accountLinksCatalogue?.content || {};
  console.log(state);
  await client.close();
}
