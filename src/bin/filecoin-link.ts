import program from "commander";
import { createCommand } from "../create-command";
import { listCommand } from "../list-command";

program.version("0.0.1");

program
  .command("create <seed> <private-key>")
  .option("-n, --network <t>", "f")
  .action(async (seed, privateKey, command) => {
    await createCommand(seed, privateKey, command.network);
  });

program.command("list <did>").action(async (did) => {
  await listCommand(did);
});

program.parse(process.argv);
