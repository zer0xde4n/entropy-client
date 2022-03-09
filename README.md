# Entropy Markets Client Library

Typescript client library for interacting with Entropy Markets. **Client code, and Entropy Markets at large, draws inspiration and is friendly forked from the Mango Markets.** In that spirit, view the Mango client repo here for more information: https://github.com/blockworks-foundation/mango-client-v3.

## Installation

Using npm:

```
npm install @friktion-labs/entropy-client
```

Using yarn:

```
yarn add @friktion-labs/entropy-client
```

## Usage Example

This example assumes that you have a wallet that is already setup with devnet tokens. The private key should be stored in `~/.config/solana/entropy-devnet-authority.json`. You can find the full source code in [example.ts](./src/example.ts).

```js
// Fetch orderbooks
const bids = await perpMarket.loadBids(connection);
const asks = await perpMarket.loadAsks(connection);

// L2 orderbook data
for (const [price, size] of bids.getL2(20)) {
  console.log(price, size);
}

// L3 orderbook data
for (const order of asks) {
  console.log(
    order.owner.toBase58(),
    order.orderId.toString('hex'),
    order.price,
    order.size,
    order.side, // 'buy' or 'sell'
  );
}

// Place order
await client.placePerpOrder(
  mangoGroup,
  mangoAccount,
  mangoGroup.mangoCache,
  perpMarket,
  owner,
  'buy', // or 'sell'
  39000,
  0.0001,
  'limit', // or 'ioc' or 'postOnly'
);

// retrieve open orders for account
const openOrders = await perpMarket.loadOrdersForAccount(
  connection,
  mangoAccount,
);

// cancel orders
for (const order of openOrders) {
  await client.cancelPerpOrder(
    mangoGroup,
    mangoAccount,
    owner,
    perpMarket,
    order,
  );
}

// Retrieve fills
for (const fill of await perpMarket.loadFills(connection)) {
  console.log(
    fill.owner.toBase58(),
    fill.maker ? 'maker' : 'taker',
    fill.baseChange.toNumber(),
    fill.quoteChange.toNumber(),
    fill.longFunding.toFixed(3),
    fill.shortFunding.toFixed(3),
  );
}
```