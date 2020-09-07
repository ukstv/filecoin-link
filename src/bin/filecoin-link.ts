import program from "commander";
// import ThreeIDAccount from '@ceramicnetwork/account-template'
// import {CeramicCliUtils} from "@ceramicnetwork/ceramic-cli";
import CeramicClient from "@ceramicnetwork/ceramic-http-client";
import ThreeIDAccount from "@ceramicnetwork/account-template";
import {LocalFilecoinProvider} from "@ukstv/local-filecoin-provider";
import {AccountID} from "caip";
// import {CeramicCliUtils} from "@ceramicnetwork/ceramic-cli";

program.version("0.0.1");

program
  .command("create <did> <private-key>")
  .option("-n, --network <t>", "m")
  .action(async (did, privateKey, command) => {
    const isTestnet = command.network !== "m"
    const client = new CeramicClient()
    const threeIDAccount = await ThreeIDAccount.build(did, client)
    const provider = new LocalFilecoinProvider(privateKey, isTestnet)
    const address = (await provider.getAccounts())[0]
    const network = isTestnet ? 'fil:t' : 'fil:m'
    const account = new AccountID(`${address}@${network}`)
    await threeIDAccount.accountLinks.add(account, {provider})
    console.log('id', threeIDAccount.accountLinks.ceramicDoc.id)
    const list = threeIDAccount.accountLinks.list()
    console.log('list', list)
    console.log('link-log', threeIDAccount.accountLinks.ceramicDoc.state.log)
    console.log('did', threeIDAccount.didDocument.did)
    // await CeramicCliUtils._runWithCeramic(async ceramic => {
    //   const account = await ThreeIDAccount.build(did, )
    // })
    // const account = await ThreeIDAccount.build(did, )
    // console.log('foo', ThreeIDAccount)
    console.log("resolve", account, did, privateKey, command);
    // await CeramicCliUtils._runWithCeramic(async ceramic => {
    //   const a = await ceramic.createDocument('tile', {
    //     foo: 33
    //   })
    //   console.log('ceramic', a)
    // })
    // console.log("a", privateKey, command.network);
    await client.close()
  });

program.parse(process.argv);
