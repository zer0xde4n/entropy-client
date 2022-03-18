/* eslint-disable @typescript-eslint/no-non-null-assertion, no-console */
import { expect } from 'chai';
import EntropyGroup from '../src/EntropyGroup';
import EntropyAccount from '../src/EntropyAccount';
import { loadTestEntropyAccount, loadTestEntropyCache, loadTestEntropyGroup, loadTestOpenOrders } from './testdata';
import { EntropyCache } from '../src';

describe('Health', async () => {
  before(async () => {
  });

  describe('empty', async () => {
    it('Health calculations should return the correct results', async () => {
      const prefix = "./testdata/empty"
      const entropyGroup: EntropyGroup = loadTestEntropyGroup(`${prefix}/group.json`)
      const entropyAccount: EntropyAccount = loadTestEntropyAccount(`${prefix}/account.json`)
      const entropyCache: EntropyCache = loadTestEntropyCache(`${prefix}/cache.json`)

      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("0");
      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("0");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("100");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("100");
      expect(
        entropyAccount.computeValue(entropyGroup, entropyCache).toString()
      ).to.equal("0");
      expect(
        entropyAccount.getLeverage(entropyGroup, entropyCache).toString()
      ).to.equal("0");
      expect(entropyAccount.isLiquidatable(entropyGroup, entropyCache)).to.be.false
    });
  });

  describe('1deposit', async () => {
    it('Health calculations should return the correct results', async () => {
      const prefix = "./testdata/1deposit"
      const entropyGroup: EntropyGroup = loadTestEntropyGroup(`${prefix}/group.json`)
      const entropyAccount: EntropyAccount = loadTestEntropyAccount(`${prefix}/account.json`)
      const entropyCache: EntropyCache = loadTestEntropyCache(`${prefix}/cache.json`)

      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("37904260000.05905822642118252475");
      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("42642292500.06652466908819931746");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("100");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("100");
      expect(
        entropyAccount.computeValue(entropyGroup, entropyCache).toString()
      ).to.equal("47380.32499999999999928946");
      expect(
        entropyAccount.getLeverage(entropyGroup, entropyCache).toString()
      ).to.equal("0");
      expect(entropyAccount.isLiquidatable(entropyGroup, entropyCache)).to.be.false
    });
  });

  describe('account1', async () => {
    it('Health calculations should return the correct results', async () => {
      const prefix = "./testdata/account1"
      const entropyGroup: EntropyGroup = loadTestEntropyGroup(`${prefix}/group.json`)
      const entropyAccount: EntropyAccount = loadTestEntropyAccount(`${prefix}/account.json`)
      entropyAccount.spotOpenOrdersAccounts[3] = loadTestOpenOrders(`${prefix}/openorders3.json`)
      entropyAccount.spotOpenOrdersAccounts[6] = loadTestOpenOrders(`${prefix}/openorders6.json`)
      entropyAccount.spotOpenOrdersAccounts[7] = loadTestOpenOrders(`${prefix}/openorders7.json`)
      const entropyCache: EntropyCache = loadTestEntropyCache(`${prefix}/cache.json`)

      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("454884281.15520619643754685058");
      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("901472688.63722587052636470162");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("10.48860467608925262084");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("20.785925232226531989");
      expect(
        entropyAccount.computeValue(entropyGroup, entropyCache).toString()
      ).to.equal("1348.25066158888197520582");
      expect(
        entropyAccount.getLeverage(entropyGroup, entropyCache).toString()
      ).to.equal("3.21671490144456129201");
      expect(entropyAccount.isLiquidatable(entropyGroup, entropyCache)).to.be.false
    });
  });

  describe('account2', async () => {
    it('Health calculations should return the correct results', async () => {
      const prefix = "./testdata/account2"
      const entropyGroup: EntropyGroup = loadTestEntropyGroup(`${prefix}/group.json`)
      const entropyAccount: EntropyAccount = loadTestEntropyAccount(`${prefix}/account.json`)
      entropyAccount.spotOpenOrdersAccounts[2] = loadTestOpenOrders(`${prefix}/openorders2.json`)
      entropyAccount.spotOpenOrdersAccounts[3] = loadTestOpenOrders(`${prefix}/openorders3.json`)
      const entropyCache: EntropyCache = loadTestEntropyCache(`${prefix}/cache.json`)

      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("7516159604.84918334545095675026");
      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("9618709877.45119083596852505025");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("24.80680004365716229131");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("31.74618756817508824497");
      expect(
        entropyAccount.computeValue(entropyGroup, entropyCache).toString()
      ).to.equal("11721.35669142618275273549");
      expect(
        entropyAccount.getLeverage(entropyGroup, entropyCache).toString()
      ).to.equal("3.56338611204225585993");
      expect(entropyAccount.isLiquidatable(entropyGroup, entropyCache)).to.be.false
    });
  });

  describe('account3', async () => {
    it('Health calculations should return the correct results', async () => {
      const prefix = "./testdata/account3"
      const entropyGroup: EntropyGroup = loadTestEntropyGroup(`${prefix}/group.json`)
      const entropyAccount: EntropyAccount = loadTestEntropyAccount(`${prefix}/account.json`)
      const entropyCache: EntropyCache = loadTestEntropyCache(`${prefix}/cache.json`)

      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("341025333625.51856223547208912805");
      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("683477170424.20340250929429970483");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("4.52652018845647319267");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("9.50397353076404272088");
      expect(
        entropyAccount.computeValue(entropyGroup, entropyCache).toString()
      ).to.equal("1025929.00722205438034961844");
      expect(
        entropyAccount.getLeverage(entropyGroup, entropyCache).toString()
      ).to.equal("6.50157472788435697453");
      expect(entropyAccount.isLiquidatable(entropyGroup, entropyCache)).to.be.false
    });
  });

  describe('account4', async () => {
    it('Health calculations should return the correct results', async () => {
      const prefix = "./testdata/account4"
      const entropyGroup: EntropyGroup = loadTestEntropyGroup(`${prefix}/group.json`)
      const entropyAccount: EntropyAccount = loadTestEntropyAccount(`${prefix}/account.json`)
      const entropyCache: EntropyCache = loadTestEntropyCache(`${prefix}/cache.json`)

      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("-848086876487.04950427436299875694");
      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("-433869053006.07361789143756070075");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("-9.30655353087566084014");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("-4.98781798472691662028");
      expect(
        entropyAccount.computeValue(entropyGroup, entropyCache).toString()
      ).to.equal("-19651.22952604663374742699");
      expect(
        entropyAccount.getLeverage(entropyGroup, entropyCache).toString()
      ).to.equal("-421.56937094643044972031");
      expect(entropyAccount.isLiquidatable(entropyGroup, entropyCache)).to.be.true
    });
  });

  describe('account5', async () => {
    it('Health calculations should return the correct results', async () => {
      const prefix = "./testdata/account5"
      const entropyGroup: EntropyGroup = loadTestEntropyGroup(`${prefix}/group.json`)
      const entropyAccount: EntropyAccount = loadTestEntropyAccount(`${prefix}/account.json`)
      entropyAccount.spotOpenOrdersAccounts[0] = loadTestOpenOrders(`${prefix}/openorders0.json`)
      entropyAccount.spotOpenOrdersAccounts[1] = loadTestOpenOrders(`${prefix}/openorders1.json`)
      entropyAccount.spotOpenOrdersAccounts[2] = loadTestOpenOrders(`${prefix}/openorders2.json`)
      entropyAccount.spotOpenOrdersAccounts[3] = loadTestOpenOrders(`${prefix}/openorders3.json`)
      entropyAccount.spotOpenOrdersAccounts[8] = loadTestOpenOrders(`${prefix}/openorders8.json`)
      const entropyCache: EntropyCache = loadTestEntropyCache(`${prefix}/cache.json`)

      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("15144959918141.09175135195858530324");
      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("15361719060997.68276021614036608298");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("878.88913077823325181726");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("946.44498820888003365326");
      expect(
        entropyAccount.computeValue(entropyGroup, entropyCache).toString()
      ).to.equal("15578478.17337437202354522015");
      expect(
        entropyAccount.getLeverage(entropyGroup, entropyCache).toString()
      ).to.equal("0.09884076560217636143");
      expect(entropyAccount.isLiquidatable(entropyGroup, entropyCache)).to.be.false
    });
  });

  describe('account6', async () => {
    it('Health calculations should return the correct results', async () => {
      const prefix = "./testdata/account6"
      const entropyGroup: EntropyGroup = loadTestEntropyGroup(`${prefix}/group.json`)
      const entropyAccount: EntropyAccount = loadTestEntropyAccount(`${prefix}/account.json`)
      entropyAccount.spotOpenOrdersAccounts[0] = loadTestOpenOrders(`${prefix}/openorders0.json`)
      entropyAccount.spotOpenOrdersAccounts[1] = loadTestOpenOrders(`${prefix}/openorders1.json`)
      entropyAccount.spotOpenOrdersAccounts[2] = loadTestOpenOrders(`${prefix}/openorders2.json`)
      entropyAccount.spotOpenOrdersAccounts[3] = loadTestOpenOrders(`${prefix}/openorders3.json`)
      entropyAccount.spotOpenOrdersAccounts[8] = loadTestOpenOrders(`${prefix}/openorders8.json`)
      const entropyCache: EntropyCache = loadTestEntropyCache(`${prefix}/cache.json`)

      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("14480970069238.33686487450164648294");
      expect(
        entropyAccount.getHealth(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("15030566251990.17026082618337312624");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Init').toString()
      ).to.equal("215.03167137712999590349");
      expect(
        entropyAccount.getHealthRatio(entropyGroup, entropyCache, 'Maint').toString()
      ).to.equal("236.77769605824430243501");
      expect(
        entropyAccount.computeValue(entropyGroup, entropyCache).toString()
      ).to.equal("15580162.40781940827396567784");
      expect(
        entropyAccount.getLeverage(entropyGroup, entropyCache).toString()
      ).to.equal("0.07913870989902704878");
      expect(entropyAccount.isLiquidatable(entropyGroup, entropyCache)).to.be.false
    });
  });
});
