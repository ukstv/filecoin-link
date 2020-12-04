import { Network } from "@glif/filecoin-address";

export function networkFromString(input: string): Network {
  const n = input as Network;
  switch (n) {
    case Network.MAIN:
      return Network.MAIN;
    case Network.TEST:
      return Network.TEST;
    default:
      throw new Error(
        `Expect network to be either ${Network.TEST} or ${Network.MAIN}`
      );
  }
}
