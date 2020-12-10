import program from "commander";
import { createCommand } from "../commands/create-command";
import { listCommand } from "../commands/list-command";
import { createRecordCommand } from "../commands/create-record-command";
import * as u8a from "uint8arrays";
import { networkFromString } from "../network-from-string";

program.version("0.0.1");

const DEFAULT_CERAMIC_ENDPOINT = "http://ceramic.ukstv.me";

program
  .command("create <seed> <private-key>")
  .option("-n, --network <t>", "Filecoin network: t for test, f for main", "f")
  .option(
    "-c, --ceramic <url>",
    "Ceramic node endpoint",
    DEFAULT_CERAMIC_ENDPOINT
  )
  .action(
    async (
      seed: string,
      privateKey: string,
      command: { network: string; ceramic?: string }
    ) => {
      const seedBytes = u8a.fromString(seed.replace(/^0x/, ""), "base16");
      const network = networkFromString(command.network);
      await createCommand(seedBytes, privateKey, network, command.ceramic);
    }
  );

program
  .command("create-record <3id-did> <private-key>")
  .option("-n, --network <t>", "Filecoin network: t for test, f for main", "f")
  .option(
    "-c, --ceramic <url>",
    "Ceramic node endpoint",
    DEFAULT_CERAMIC_ENDPOINT
  )
  .action(
    async (
      seed: string,
      privateKey: string,
      command: { network: string; ceramic?: string }
    ) => {
      const network = networkFromString(command.network);
      await createRecordCommand(seed, privateKey, network, command.ceramic);
    }
  );

program
  .command("list <did>")
  .option(
    "-c, --ceramic <url>",
    "Ceramic node endpoint",
    DEFAULT_CERAMIC_ENDPOINT
  )
  .action(async (did, command) => {
    await listCommand(did, command.ceramic);
  });

program.parse(process.argv);
