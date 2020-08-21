import { LinkProof } from "./link-proof";
// import Message from '@openworklabs/filecoin-message'

export async function createLink(
  did: string,
  privateKey: string
): Promise<LinkProof> {
  const signingTools = await import("@zondax/filecoin-signing-tools");
  const buf = Buffer.from(privateKey, "hex");
  const json = JSON.parse(buf.toString());
  // const Type = json.Type
  const testnet = true;
  const privateKeyA = signingTools.keyRecover(json.PrivateKey, testnet);
  console.log(privateKeyA.address);
  const opts = {
    from: privateKeyA.address,
    to: privateKeyA.address,
    value: '0',
    method: 0,
    gasPrice: '1',
    gasLimit: 1000,
    nonce: 0,
    params: ''
  }
  const enc = signingTools.transactionSerialize(opts)
  console.log('enc', enc)
  // const message = new Message(opts)
  const foosig = signingTools.transactionSign(
    opts,
    privateKeyA.private_hexstring
  );
  console.log('s', foosig)
  const recover = signingTools.verifySignature(foosig.signature.data, enc)
  console.log('r', recover)
  // console.log(rustModule.keyRecover(PrivateKey, testnet).address)
  //   console.log(buf.toString())
  console.log("did", did, privateKey);
  throw new Error(`Not implemented`);
}
