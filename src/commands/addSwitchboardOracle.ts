import { Account, Connection, PublicKey, SystemInstruction } from '@solana/web3.js';
import { MangoClient } from '../client';
import { getOracleBySymbol, GroupConfig } from '../config';

// devnet
const SWITCHBOARD_ORACLES_DEVNET = {
  // MNGO: '8k7F9Xb36oFJsjpCKpsXvg4cgBRoZtwNTc3EzG5Ttd2o',
  // // SOL2: '83jN7eN5wUBsTAZ7tMrmpQxw6qQfTD8FrpuYS32hZBqT'
  // SOL: 'GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR',
  // SOL2: '83jN7eN5wUBsTAZ7tMrmpQxw6qQfTD8FrpuYS32hZBqT',
  // BTC: '8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee',
  // 'BTC^2': '8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee',
  // BTC_1D_IV: 'GHSk7tFwEaT914kL168wcKZnwHq7opZ8GNAoV56xHmJM',
  // BTC_7D_IV: 'FrqVoiu2raniHHNHguyz88r7JebpYKqjERikvJxujmUi',
  // BTC_14D_IV: '8qvGHYRHknsTEU2h3UBAdbrtqdEBUufGwHpog1XeFRh5',
  // BTC_28D_IV: '89xjL6wKFS7G9TjjcjydXUm69QjKjaNJrJwy3sdD4kN3',
};

// mainnet
const SWITCHBOARD_ORACLES_MAINNET = {
  'BTC^2': '3HtmwdXJPAdMZ73fTGeCFgbDQZGLZWpmsm3JAB5quGJN',
  BTC_1D_IV: '57HtzNrNGP7LtzsdRbmFqj5jgHUKL2HR2wnrPSrd4Qyu'
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
