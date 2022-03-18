import { Account, Connection } from '@solana/web3.js';
import { uiToNative } from '..';
// import { uiToNative } from '..';
import { EntropyClient } from '../client';
import {
  getOracleBySymbol,
  getPerpMarketByBaseSymbol,
  getTokenBySymbol,
  GroupConfig,
  entropyMints,
  // entropyMints,
  OracleConfig
} from '../config';

export default async function addPerpMarket(
  connection: Connection,
  payer: Account,
  groupConfig: GroupConfig,
  symbol: string,
  maintLeverage: number,
  initLeverage: number,
  liquidationFee: number,
  makerFee: number,
  takerFee: number,
  baseLotSize: number,
  quoteLotSize: number,
  maxNumEvents: number,
  rate: number,
  maxDepthBps: number,
  targetPeriodLength: number,
  mngoPerPeriod: number,
  exp: number,
): Promise<GroupConfig> {
  console.log({
    connection,
    payer,
    groupConfig,
    symbol,
  });

  const client = new EntropyClient(connection, groupConfig.entropyProgramId);

  let group = await client.getEntropyGroup(groupConfig.publicKey);
  const oracleDesc = getOracleBySymbol(groupConfig, symbol) as OracleConfig;
  const marketIndex = group.getOracleIndex(oracleDesc.publicKey);

  // Adding perp market
  const nativeMngoPerPeriod = 0;
  // if (rate !== 0) {
  //   const token = getTokenBySymbol(groupConfig, 'MNGO');
  //   if (token === undefined) {
  //     throw new Error('MNGO not found in group config');
  //   } else {
  //     nativeMngoPerPeriod = uiToNative(
  //       mngoPerPeriod,
  //       token.decimals,
  //     ).toNumber();
  //   }
  // }

  console.log('running addPerpMarket');

  await client.addPerpMarket(
    group,
    oracleDesc.publicKey,
    entropyMints[groupConfig.cluster],
    payer,
    maintLeverage,
    initLeverage,
    liquidationFee,
    makerFee,
    takerFee,
    baseLotSize,
    quoteLotSize,
    maxNumEvents,
    rate,
    maxDepthBps,
    targetPeriodLength,
    nativeMngoPerPeriod,
    exp,
  );

  console.log('done');
  group = await client.getEntropyGroup(groupConfig.publicKey);
  const marketPk = group.perpMarkets[marketIndex].perpMarket;
  console.log("cluster: ", groupConfig.cluster);
  let baseDecimals: number;
  try {
    baseDecimals = getTokenBySymbol(groupConfig, symbol)
    ?.decimals as number;
  } catch (err) {
    console.log('defaulting to six decimals for ', symbol, '!');
    baseDecimals = 6;
  }

  const quoteDecimals = getTokenBySymbol(groupConfig, groupConfig.quoteSymbol)
    ?.decimals as number;
  const market = await client.getPerpMarket(
    marketPk,
    baseDecimals,
    quoteDecimals,
  );

  const marketDesc = {
    name: `${symbol}-PERP`,
    publicKey: marketPk,
    baseSymbol: symbol,
    baseDecimals,
    quoteDecimals,
    marketIndex,
    bidsKey: market.bids,
    asksKey: market.asks,
    eventsKey: market.eventQueue,
  };

  const marketConfig = getPerpMarketByBaseSymbol(groupConfig, symbol);
  if (marketConfig) {
    Object.assign(marketConfig, marketDesc);
  } else {
    groupConfig.perpMarkets.push(marketDesc);
  }

  return groupConfig;
}
