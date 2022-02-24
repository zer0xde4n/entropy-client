import { Account, Connection, PublicKey, SystemInstruction } from '@solana/web3.js';
import { MangoClient } from '../client';
import { getOracleBySymbol, GroupConfig } from '../config';

// devnet
const SWITCHBOARD_ORACLES_DEVNET = {
  MNGO: '8k7F9Xb36oFJsjpCKpsXvg4cgBRoZtwNTc3EzG5Ttd2o',
  // SOL2: '83jN7eN5wUBsTAZ7tMrmpQxw6qQfTD8FrpuYS32hZBqT'
  SOL: 'GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR',
  SOL2: '83jN7eN5wUBsTAZ7tMrmpQxw6qQfTD8FrpuYS32hZBqT',
  BTC: '8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee',
  GVOL7D: 'FrqVoiu2raniHHNHguyz88r7JebpYKqjERikvJxujmUi'
};

// mainnet
const SWITCHBOARD_ORACLES_MAINNET = {
  RAY: 'AS2yMpqPY16tY5hQmpdkomaqSckMuDvR6K9P9tk9FA4d',
  MNGO: '49cnp1ejyvQi3CJw3kKXNCDGnNbWDuZd3UG3Y2zGvQkX',
};

export default async function addSwitchboardOracle(
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


  const client = new MangoClient(connection, groupConfig.mangoProgramId);
  const group = await client.getMangoGroup(groupConfig.publicKey);
  let oraclePk;
  if (groupConfig.cluster === 'mainnet') {
    oraclePk = new PublicKey(SWITCHBOARD_ORACLES_MAINNET[symbol]);
  } else {
    oraclePk = new PublicKey(SWITCHBOARD_ORACLES_DEVNET[symbol]);
  }

  console.log('oracle pk = ', oraclePk.toString());

  await client.addOracle(group, oraclePk, payer);

  const oracle = {
    symbol: symbol,
    publicKey: oraclePk,
  };

  const _oracle = getOracleBySymbol(groupConfig, symbol);
  if (_oracle) {
    Object.assign(_oracle, oracle);
  } else {
    groupConfig.oracles.push(oracle);
  }

  return groupConfig;
}
