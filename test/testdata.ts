import { OpenOrders } from '@project-serum/serum';
import { PublicKey } from '@solana/web3.js';
import { EntropyGroup, RootBank } from '../src';
import { EntropyAccountLayout, EntropyCache, EntropyCacheLayout, EntropyGroupLayout, NodeBank, NodeBankLayout, RootBankLayout } from '../src/layout';
import EntropyAccount from '../src/EntropyAccount';

export function loadTestEntropyGroup(filename: string): EntropyGroup {
  const accountJson: { [key: string]: any } = require(filename);
  const data = Buffer.from(accountJson.data[0], 'base64');
  const layout = EntropyGroupLayout.decode(data)
  return new EntropyGroup(new PublicKey(accountJson.address), layout)
}

export function loadTestEntropyAccount(filename: string): EntropyAccount {
  const accountJson: { [key: string]: any } = require(filename);
  const data = Buffer.from(accountJson.data[0], 'base64');
  const layout = EntropyAccountLayout.decode(data)
  return new EntropyAccount(new PublicKey(accountJson.address), layout)
}

export function loadTestOpenOrders(filename: string): OpenOrders {
  const openOrdersJson: { [key: string]: any } = require(filename);
  const data = Buffer.from(openOrdersJson.data[0], 'base64');
  const layout = OpenOrders.getLayout(new PublicKey(0)).decode(data)
  return new OpenOrders(new PublicKey(openOrdersJson.address), layout, new PublicKey(0))
}

export function loadTestEntropyCache(filename: string): EntropyCache {
  const accountJson: { [key: string]: any } = require(filename);
  const data = Buffer.from(accountJson.data[0], 'base64');
  const layout = EntropyCacheLayout.decode(data)
  return new EntropyCache(new PublicKey(accountJson.address), layout)
}

export function loadTestEntropyRootBank(filename: string): RootBank {
  const accountJson: { [key: string]: any } = require(filename);
  const data = Buffer.from(accountJson.data[0], 'base64');
  const layout = RootBankLayout.decode(data)
  return new RootBank(new PublicKey(accountJson.address), layout)
}

export function loadTestEntropyNodeBank(filename: string): NodeBank {
  const accountJson: { [key: string]: any } = require(filename);
  const data = Buffer.from(accountJson.data[0], 'base64');
  const layout = NodeBankLayout.decode(data)
  return new NodeBank(new PublicKey(accountJson.address), layout)
}
