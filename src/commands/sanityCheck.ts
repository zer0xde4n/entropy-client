import { Connection, PublicKey } from '@solana/web3.js';
import { EntropyClient } from '../client';
import EntropyAccount from '../EntropyAccount';
import PerpMarket from '../PerpMarket';
import { getPerpMarketByIndex, getTokenByMint, GroupConfig } from '../config';
import { EntropyCache, QUOTE_INDEX } from '../layout';
import { I80F48, ZERO_I80F48 } from '../fixednum';
import { ZERO_BN, zeroKey } from '../utils';
import RootBank from '../RootBank';

async function setUp(client: EntropyClient, entropyGroupKey: PublicKey) {
  const entropyGroup = await client.getEntropyGroup(entropyGroupKey);
  await entropyGroup.loadRootBanks(client.connection);

  const entropyAccounts = await client.getAllEntropyAccounts(
    entropyGroup,
    undefined,
    true,
  );

  const entropyCache = await entropyGroup.loadCache(client.connection);
  const perpMarkets: (PerpMarket | undefined)[] = await Promise.all(
    entropyGroup.perpMarkets.map((pmi, i) =>
      pmi.isEmpty()
        ? undefined
        : client.getPerpMarket(
            pmi.perpMarket,
            entropyGroup.tokens[i].decimals,
            entropyGroup.tokens[QUOTE_INDEX].decimals,
          ),
    ),
  );

  return { entropyGroup, entropyCache, entropyAccounts, perpMarkets };
}

function checkSumOfBasePositions(
  groupConfig: GroupConfig,
  entropyCache: EntropyCache,
  entropyAccounts: EntropyAccount[],
  perpMarkets: (PerpMarket | undefined)[],
) {
  let totalBase = ZERO_BN;
  let totalQuote = ZERO_I80F48;

  for (let i = 0; i < QUOTE_INDEX; i++) {
    if (perpMarkets[i] === undefined) {
      continue;
    }
    const perpMarket = perpMarkets[i] as PerpMarket;
    let sumOfAllBasePositions = ZERO_BN;
    let absBasePositions = ZERO_BN;
    let sumQuote = perpMarket.feesAccrued;
    const perpMarketCache = entropyCache.perpMarketCache[i];
    for (const entropyAccount of entropyAccounts) {
      const perpAccount = entropyAccount.perpAccounts[i];
      sumOfAllBasePositions = sumOfAllBasePositions.add(
        perpAccount.basePosition,
      );
      absBasePositions = absBasePositions.add(perpAccount.basePosition.abs());
      sumQuote = sumQuote.add(perpAccount.getQuotePosition(perpMarketCache));
    }

    console.log(
      `Market: ${getPerpMarketByIndex(groupConfig, i)?.name}
      Sum Base Pos: ${sumOfAllBasePositions.toString()}
      Sum Abs Base Pos ${absBasePositions.toString()}
      Open Interest: ${perpMarket.openInterest.toString()}
      Sum Quote: ${sumQuote.toString()}\n`,
    );

    totalBase = totalBase.add(sumOfAllBasePositions);
    totalQuote = totalQuote.add(sumQuote);
  }

  console.log(
    `Total Base: ${totalBase.toString()}\nTotal Quote: ${totalQuote.toString()}`,
  );
}

async function checkSumOfNetDeposit(
  groupConfig,
  connection,
  entropyGroup,
  entropyCache,
  entropyAccounts,
) {
  for (let i = 0; i < entropyGroup.tokens.length; i++) {
    if (entropyGroup.tokens[i].mint.equals(zeroKey)) {
      continue;
    }
    console.log('======');
    console.log(getTokenByMint(groupConfig, entropyGroup.tokens[i].mint)?.symbol);
    console.log(
      'deposit index',
      entropyCache.rootBankCache[i].depositIndex.toString(),
    );
    console.log(
      'borrow index',
      entropyCache.rootBankCache[i].borrowIndex.toString(),
    );

    const sumOfNetDepositsAcrossMAs = entropyAccounts.reduce(
      (sum, entropyAccount) => {
        return sum.add(entropyAccount.getNet(entropyCache.rootBankCache[i], i));
      },
      ZERO_I80F48,
    );
    console.log(
      'sumOfNetDepositsAcrossMAs:',
      sumOfNetDepositsAcrossMAs.toString(),
    );

    let vaultAmount = ZERO_I80F48;
    const rootBank = entropyGroup.rootBankAccounts[i] as RootBank;
    if (rootBank) {
      const nodeBanks = rootBank.nodeBankAccounts;
      const vaults = await Promise.all(
        nodeBanks.map((n) => connection.getTokenAccountBalance(n.vault)),
      );
      const sumOfNetDepositsAcrossNodes = nodeBanks.reduce((sum, nodeBank) => {
        return sum.add(
          nodeBank.deposits.mul(entropyCache.rootBankCache[i].depositIndex),
        );
      }, ZERO_I80F48);
      const sumOfNetBorrowsAcrossNodes = nodeBanks.reduce((sum, nodeBank) => {
        return sum.add(
          nodeBank.borrows.mul(entropyCache.rootBankCache[i].borrowIndex),
        );
      }, ZERO_I80F48);
      console.log(
        'sumOfNetDepositsAcrossNodes:',
        sumOfNetDepositsAcrossNodes.toString(),
      );
      console.log(
        'sumOfNetBorrowsAcrossNodes:',
        sumOfNetBorrowsAcrossNodes.toString(),
      );

      for (const vault of vaults) {
        // @ts-ignore
        vaultAmount = vaultAmount.add(I80F48.fromString(vault.value.amount));
      }
      console.log('vaultAmount:', vaultAmount.toString());

      console.log(
        'nodesDiff:',
        vaultAmount
          .sub(sumOfNetDepositsAcrossNodes)
          .add(sumOfNetBorrowsAcrossNodes)
          .toString(),
      );
    }

    console.log('Diff', vaultAmount.sub(sumOfNetDepositsAcrossMAs).toString());
  }
}

export default async function sanityCheck(
  connection: Connection,
  groupConfig: GroupConfig,
) {
  const client = new EntropyClient(connection, groupConfig.entropyProgramId);
  const { entropyGroup, entropyCache, entropyAccounts, perpMarkets } = await setUp(
    client,
    groupConfig.publicKey,
  );
  checkSumOfBasePositions(groupConfig, entropyCache, entropyAccounts, perpMarkets);
  await checkSumOfNetDeposit(
    groupConfig,
    connection,
    entropyGroup,
    entropyCache,
    entropyAccounts,
  );
}
