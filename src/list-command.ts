import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import { IDX } from "@ukstv/ceramicstudio-idx";
import * as _ from 'lodash'

const schemas: Record<string, string> = {
  BasicProfile:
    "ceramic://bagcqceram3zvgd4y6ggl3bkoprtlmrvsorsdnkg3e2g4rd5xywqwv3wcaj4q",
  Definition:
    "ceramic://bagcqcerau4zp2ulb45mem3khalj35dtlmknsy2jvt4kmdqp7ihvy7nv46asa",
  DocIdDocIdMap:
    "ceramic://bagcqceral72u2ghww67eqtw22pk2hjxb2iwglqegccguqf6yhrnivrm7k3va",
  DocIdMap:
    "ceramic://bagcqceraub7atazkr7rgibvkulcu47otimzaejqdlft4bl6ietyhmx2svwma",
  RootIndex:
    "ceramic://bagcqcera4xpocatz5wuftjkwwvraafaniywaey5vkhkvvas3fhqc5i4nx2pa",
  StringMap:
    "ceramic://bagcqcera7gva3wbetgzncdwvbni4vd37bc62huevcmvyezzcvwkchvw36mwa",
  CryptoAccountLinks:
    "ceramic://bagcqcera4wduhtkgxuqg73wxowlieykt6iwtlldfwzug3brpfuqlu2x4yazq",
};

const AccountLinksDefinition =
  "ceramic://bagcqcerab36ia3na5kpeyh4mfazrc2gjb7d4a6p2m3rcniyzuo2z4ep3wjoa";

export async function listCommand(did: string) {
  const ceramic = new CeramicClient();
  const idx = new IDX({ ceramic, schemas });
  const accountLinkDocuments = await idx.get<Record<string, string>>(AccountLinksDefinition, did)
  let accounts: string[] = []
  for (let account in accountLinkDocuments) {
    const docId = accountLinkDocuments[account]
    const document = await ceramic.loadDocument(docId)
    if (_.isString(document.content) && document.content === did) {
      accounts.push(account)
    }
  }
  console.log(`Linked to ${did}:`)
  console.log(accounts)
  await ceramic.close();
}
