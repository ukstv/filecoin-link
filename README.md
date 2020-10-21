# Filecoin Link

Add Filecoin-related account-link to 3id IDX.

# Usage

## Create Link

Create `account-link` record for Filecoin address (derived from `filecoin-private-key`),
and add it to 3id IDX.

```
filecoin-link create <3id-seed> <filecoin-private-key>
```

For example:

```
filecoin-link create 0x6e34b2e1a9624113d81ece8a8a22e6e97f0e145c25c1d4d2d0e62753b4060c837097f768559e17ec89ee20cba153b23b9987912ec1e860fa1212ba4b84c776ce 7b2254797065223a22736563703235366b31222c22507269766174654b6579223a2257587362654d5176487a366f5668344b637262633045642b31362b3150766a6a504f3753514931355031343d227d
```

Optionally, you could specify Filecoin network: `t` is for testnet, `f` is for mainnet.

```
filecoin-link create <3id-seed> <filecoin-private-key> --network [t|f]
```

This would report:

```
Linked t17lxg2i2otnl7mmpw2ocd6o4e3b4un3272vny6ka to did:3:bafyreidadca3mmq33wtjcxnapojyjkodxdklvqm6jpanqsewnxxri4mhei
```

## Create Link Record

Just create `account-link` record for Filecoin address (derived from `filecoin-private-key`).

```
filecoin-link create-record <3id-did> <filecoin-private-key>
```

For example:

```
filecoin-link create-record did:3:bafyreidadca3mmq33wtjcxnapojyjkodxdklvqm6jpanqsewnxxri4mhei 7b2254797065223a22736563703235366b31222c22507269766174654b6579223a2257587362654d5176487a366f5668344b637262633045642b31362b3150766a6a504f3753514931355031343d227d
```

Optionally, you could specify Filecoin network: `t` is for testnet, `f` is for mainnet.

```
filecoin-link create-record <3id-did> <filecoin-private-key> --network [t|f]
```

This would report:

```
Linked t17lxg2i2otnl7mmpw2ocd6o4e3b4un3272vny6ka to did:3:bafyreidadca3mmq33wtjcxnapojyjkodxdklvqm6jpanqsewnxxri4mhei
```

## List all links

```
filecoin-link list <3id-did>
```

For example, after the `filecoin-link create` call above `filecoin-link list` would report:

```
{
  'ceramic://bafyreifrew2vi5tk2veylgcqjapioxibxze6sfqs2ljsd4724tcm4j7vku': {
    type: 'eoa-tx',
    account: 't17lxg2i2otnl7mmpw2ocd6o4e3b4un3272vny6ka@fil:t',
    message: 'Create a new 3Box profile\n' +
      '\n' +
      '- \n' +
      'Your unique profile ID is did:3:bafyreidadca3mmq33wtjcxnapojyjkodxdklvqm6jpanqsewnxxri4mhei \n' +
      'Timestamp: 1599568355',
    version: 2,
    signature: 'nlxcp9kSduowOrdv7SHSYwK3agguBGXwNGs0gzTCm0h/eH6fRAcb+IHyolJfeT6yX7tCdBtU5m93/yFrRlzUSgE=',
    timestamp: 1599568355
  }
}
```

## Ceramic Connection

The commands above connect to Ceramic node on `http://localhost:7007` by default. You could override that
by specifying endpoint as `-c` or `--ceramic` option. For example:

```shell script
filecoin-link list bafyreidadca3mmq33wtjcxnapojyjkodxdklvqm6jpanqsewnxxri4mhei --ceramic http://other-host:7007
```
