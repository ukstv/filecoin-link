import program from 'commander'
import * as path from 'path'
import * as fs from 'fs'
import {createLink} from "../create-link";

const packageJSONPath = path.resolve(__dirname, '../../package.json')
const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath).toString())

program.version(packageJSON.version)
program.command('create <did> <private-key>')
  .option('-o, --out <proof-path>')
  .description('Link private key to DID, emit account-link document')
  .action(async (did, privateKey, program) => {
    const proof = await createLink(did, privateKey)
    console.log(did, privateKey, program.out)
    console.log('proof', proof)
  })
program.command('validate <proof-path>')
  .description('Validate proof')
  .action((proofPath) => {
    console.log('TODO')
    console.log(proofPath)
  })

program.parse(process.argv)
