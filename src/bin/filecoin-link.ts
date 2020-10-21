import program from "commander";
import { createCommand } from "../commands/create-command";
import { listCommand } from "../commands/list-command";
import { createRecordCommand } from "../commands/create-record-command";

program.version("0.0.1");

program
  .command("create <seed> <private-key>")
  .option("-n, --network <t>", "f")
  .option("-c, --ceramic <url>")
  .action(async (seed, privateKey, command) => {
    await createCommand(seed, privateKey, command.network, command.ceramic);
  });

program
  .command("create-record <3id-did> <private-key>")
  .option("-n, --network <t>", "f")
  .option("-c, --ceramic <url>")
  .action(async (seed, privateKey, command) => {
    await createRecordCommand(
      seed,
      privateKey,
      command.network,
      command.ceramic
    );
  });

program
  .command("list <did>")
  .option("-c, --ceramic <url>")
  .action(async (did, command) => {
    await listCommand(did, command.ceramic);
  });

program.parse(process.argv);
