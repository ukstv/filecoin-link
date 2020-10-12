import program from "commander";
import { createCommand } from "../commands/create-command";
import { listCommand } from "../commands/list-command";
import { createRecordCommand } from "../commands/create-record-command";

program.version("0.0.1");

program
  .command("create <seed> <private-key>")
  .option("-n, --network <t>", "f")
  .action(async (seed, privateKey, command) => {
    await createCommand(seed, privateKey, command.network);
  });

program
  .command("create-record <3id-did> <private-key>")
  .option("-n, --network <t>", "f")
  .action(async (seed, privateKey, command) => {
    await createRecordCommand(seed, privateKey, command.network);
  });

program.command("list <did>").action(async (did) => {
  await listCommand(did);
});

program.parse(process.argv);
