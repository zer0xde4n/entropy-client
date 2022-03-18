/* eslint-disable @typescript-eslint/no-non-null-assertion, no-console */
import { Account } from '@solana/web3.js';
import { expect } from 'chai';
import * as Test from './utils';
import { EntropyClient } from '../src';
import EntropyGroup from '../src/EntropyGroup';
import { QUOTE_INDEX } from '../src/layout';
import { sleep, zeroKey } from '../src/utils';
import EntropyAccount from '../src/EntropyAccount';

describe('EntropyClient', async () => {
  let client: EntropyClient;
  let payer: Account;
  const connection = Test.createDevnetConnection();

  before(async () => {
    client = new EntropyClient(connection, Test.EntropyProgramId);
    sleep(2000); // sleeping because devnet rate limits suck
    payer = await Test.createAccount(connection);
    sleep(2000); // sleeping because devnet rate limits suck
  });

  describe('initEntropyGroup', async () => {
    it('should successfully create a EntropyGroup', async () => {
      sleep(1000); // sleeping because devnet rate limits suck
      const groupKey = await client.initEntropyGroup(
        Test.USDCMint,
        Test.MSRMMint,
        Test.DexProgramId,
        Test.FeesVault,
        5,
        0.7,
        0.06,
        1.5,
        payer,
      );
      const group = await client.getEntropyGroup(groupKey);
      expect(groupKey).to.not.be.undefined;
      expect(group).to.not.be.undefined;
      expect(group.tokens[QUOTE_INDEX].mint.toBase58(), 'quoteMint').to.equal(
        Test.USDCMint.toBase58(),
      );
      expect(group.admin.toBase58(), 'admin').to.equal(
        payer.publicKey.toBase58(),
      );
      expect(group.dexProgramId.toBase58(), 'dexPerogramId').to.equal(
        Test.DexProgramId.toBase58(),
      );
    });
  });

  describe('cacheRootBanks', async () => {
    let group: EntropyGroup;

    before(async () => {
      const groupKey = await client.initEntropyGroup(
        Test.USDCMint,
        Test.MSRMMint,
        Test.DexProgramId,
        Test.FeesVault,
        5,
        0.7,
        0.06,
        1.5,
        payer,
      );
      group = await client.getEntropyGroup(groupKey);
    });

    it('should successfully update the cache', async () => {
      const rootBankPks = group.tokens
        .filter((tokenInfo) => !tokenInfo.mint.equals(zeroKey))
        .map((tokenInfo) => tokenInfo.rootBank);

      await client.cacheRootBanks(
        group.publicKey,
        group.entropyCache,
        rootBankPks,
        payer,
      );
    });
  });

  describe.skip('initEntropyAccount, deposit, and withdraw', async () => {
    let group: EntropyGroup;
    let user: Account;
    let entropyAccount: EntropyAccount;
    let userTokenAcc: Account;

    before(async () => {
      const groupKey = await client.initEntropyGroup(
        Test.USDCMint,
        Test.MSRMMint,
        Test.DexProgramId,
        Test.FeesVault,
        5,
        0.7,
        0.06,
        1.5,
        payer,
      );
      group = await client.getEntropyGroup(groupKey);
      user = await Test.createAccount(connection, 5);
      const entropyAccountPk = await client.initEntropyAccount(group, user);
      entropyAccount = await client.getEntropyAccount(
        entropyAccountPk,
        Test.DexProgramId,
      );
    });

    xit('deposit USDC and then WITHDRAW the USDC', async () => {
      const rootBanks = await group.loadRootBanks(client.connection);
      const usdcRootBank = rootBanks[QUOTE_INDEX];

      if (usdcRootBank) {
        const nodeBanks = await usdcRootBank.loadNodeBanks(client.connection);

        const filteredNodeBanks = nodeBanks.filter((nodeBank) => !!nodeBank);
        expect(filteredNodeBanks.length).to.equal(1);

        await client.deposit(
          group,
          entropyAccount,
          user,
          group.tokens[QUOTE_INDEX].rootBank,
          usdcRootBank.nodeBanks[0],
          filteredNodeBanks[0]!.vault,
          userTokenAcc.publicKey,
          10,
        );
      }
    });
  });
});
