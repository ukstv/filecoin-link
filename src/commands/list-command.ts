import CeramicClient from "@ceramicnetwork/http-client";
import * as idxTools from "@ceramicstudio/idx-tools";
import { IDX } from "@ceramicstudio/idx";
import * as _ from "lodash";

export async function listCommand(did: string, ceramicEndpoint?: string) {
  const ceramic = new CeramicClient(ceramicEndpoint);
  const idx = new IDX({ ceramic });
  const { definitions } = await idxTools.publishIDXConfig(ceramic);
  const accountLinkDocuments = await idx.get<Record<string, string>>(
    definitions.cryptoAccounts,
    did
  );
  let accounts: string[] = [];
  for (let account in accountLinkDocuments) {
    const docId = accountLinkDocuments[account];
    const document = await ceramic.loadDocument(docId);
    if (_.isString(document.content) && document.content === did) {
      accounts.push(account);
    }
  }
  console.log(`Linked to ${did}:`);
  console.log(accounts);
  await ceramic.close();
}
