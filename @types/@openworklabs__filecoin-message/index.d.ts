declare module "@openworklabs/filecoin-message" {
  interface MessageParams {
    from: string;
    to: string;
    value: string;
    gasPrice: string;
    gasLimit: number;
    nonce: number;
    method: number;
    params: string;
  }

  class Message {
    constructor(params: MessageParams);
  }

  export default Message;
}
