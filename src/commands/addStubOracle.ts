import { Account, Connection } from '@solana/web3.js';
import { EntropyClient } from '../client';
import { getOracleBySymbol, GroupConfig } from '../config';

export default async function addStubOracle(
  connection: Connection,
  payer: Account,
  groupConfig: GroupConfig,
  symbol: string,
): Promise<GroupConfig> {
  console.log({
    connection,
    payer,
    groupConfig,
    symbol,
  });

  const client = new EntropyClient(connection, groupConfig.entropyProgramId);
  await client.addStubOracle(groupConfig.publicKey, payer);
  const group = await client.getEntropyGroup(groupConfig.publicKey);

  const oracle = {
    symbol: symbol,
    publicKey: group.oracles[group.numOracles - 1],
  };

  const _oracle = getOracleBySymbol(groupConfig, symbol);
  if (_oracle) {
    Object.assign(_oracle, oracle);
  } else {
    groupConfig.oracles.push(oracle);
  }

  return groupConfig;
}
