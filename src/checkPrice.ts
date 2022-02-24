import * as os from 'os';
import * as fs from 'fs';
import { MangoClient } from './client';
import { Account, Commitment, Connection } from '@solana/web3.js';
import configFile from './ids.json';
import { Config, getMarketByBaseSymbolAndKind, GroupConfig } from './config';
import { Market } from '@project-serum/serum';
import { ZERO_BN } from './utils';
import MangoGroup from './MangoGroup';

function readKeypair() {
  return JSON.parse(
    process.env.KEYPAIR ||
      fs.readFileSync(os.homedir() + '/.config/solana/entropy-devnet-authority.json', 'utf-8'),
  );
}

function readKeypair_opp() {
  return JSON.parse(
    process.env.KEYPAIR ||
      fs.readFileSync(os.homedir() + '/.config/solana/id.json', 'utf-8'),
  );
}

async function checkPrice() {
  // setup client
  const config = new Config(configFile);
  const groupConfig = config.getGroup(
    'devnet',
    'devnet.2',
  ) as GroupConfig;
  const connection = new Connection(
    'https://api.devnet.solana.com',
    'processed' as Commitment,
  );
  const client = new MangoClient(connection, groupConfig.mangoProgramId);
  const mangoGroup = await client.getMangoGroup(groupConfig.publicKey);

  console.log('group key = ', groupConfig.publicKey.toString());

  console.log('tokens: ', mangoGroup.tokens);
  // console.log('spot markets: ', mangoGroup.spotMarkets);
  // console.log('perp markets: ', mangoGroup.perpMarkets);
  
  // load group & market
  const perpMarketConfig = getMarketByBaseSymbolAndKind(
    groupConfig,
    'SOL',
    'perp',
  );

  const perpMarket = await mangoGroup.loadPerpMarket(
    connection,
    perpMarketConfig.marketIndex,
    perpMarketConfig.baseDecimals,
    perpMarketConfig.quoteDecimals,
  );

  console.log("INDEX: ",perpMarketConfig.marketIndex);
  console.log("MARKET INFO: ", perpMarket.toPrettyString(mangoGroup, perpMarketConfig));
  // Fetch orderbooks
  const bids = await perpMarket.loadBids(connection);
  const asks = await perpMarket.loadAsks(connection);

  // Load Cache
  const mangoCache = await mangoGroup.loadCache(connection);

  console.log("CACHE SHIT: ", mangoCache.priceCache[7].lastUpdate.toString());

  // Load funding rate
  const funding_rate = await perpMarket.getCurrentFundingRate(mangoGroup, mangoCache, perpMarketConfig.marketIndex, bids, asks);
  console.log("FUNDING RATE: ", funding_rate.toString());

  // Load price
  console.log("DECIMALS: ", mangoGroup.getTokenDecimals(perpMarketConfig.marketIndex));
  console.log("RAW PRICE: ", mangoCache.priceCache[perpMarketConfig.marketIndex].price.toString())
  console.log("UI PRICE: ", mangoGroup.getPriceUi(perpMarketConfig.marketIndex, mangoCache).toString());
  const price = mangoCache.priceCache[perpMarketConfig.marketIndex].price
  console.log("CACHE TO UI PRICE: ", mangoGroup.cachePriceToUi(price, perpMarketConfig.marketIndex))
  // console.log('prices = ', mangoCache.priceCache);
  }

checkPrice();
