/**
 * How to use:
 * 1.) Update the mango group name on line 7
 * 2.) Run yarn launch-realistic-group
 * 3.) Update the mango group name in keeper.ts crank.ts and in the UI in useMangoStore.ts
 */


const newGroupName = 'mainnet.1';
const entropyProgramId = 'FcfzrnurPFXwxbx332wScnD5P86DwhpLpBbQsnr6LcH5';
const serumProgramId = '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin';
const feesVault = 'GWFVVXwN8Xdb1NdoP5M59HiNWo2zkHyYUZ7dwwNHz6EE'; // token address of USDC owned by thiccy

const FIXED_IDS: any[] = [
  {
    symbol: 'BTC^2',
    decimals: 6,
    baseLot: 100,
    quoteLot: 10,
    oracleProvider: 'switchboard',
    oracle: "74YzQPGUT9VnjrBz8MuyDLKgKpbDqGot5xZJvTtMi6Ng",
    mint: '4Yi8HN43u57tbbmX2PU7Sz77uH1b5ZwGmDKvary9ApD3',
    initLeverage: 1,
    maintLeverage: 1.05,
    liquidationFee: 0.10,
  },  
  {
    symbol: 'USDC',
    decimals: 6,
    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  },
  // {
  //   symbol: 'BTC',
  //   decimals: 6,
  //   baseLot: 100,
  //   quoteLot: 10,
  //   oracleProvider: 'pyth',
  //   mint: '4Yi8HN43u57tbbmX2PU7Sz77uH1b5ZwGmDKvary9ApD3',
  //   initLeverage: 1.5,
  //   maintLeverage: 2,
  // },
  // {
  //   symbol: 'BTC_1D_IV',
  //   decimals: 9,
  //   baseLot: 10000,
  //   quoteLot: 100,
  //   oracleProvider: 'switchboard',
  //   oracle: "6nkKqyx8fU1MyUHqY6UBMc17ib4U6BzWSeyP24YBFoWN",
  //   mint: '5CzFkazo1iWqLFMoDSw2RSo6u5Z1fqPDwdsGMczoGBQ6',
  //   initLeverage: 1.5,
  //   maintLeverage: 2,
  //   liquidationFee: 0.10,
  // }
];

const initNewGroup = async () => {
  // const connection: Connection = Test.createDevnetConnection();
  // const mints = IDS.filter((id) => id.symbol !== 'USDC').map((id) => id.mint);
  console.log('starting');
  const quoteMint = FIXED_IDS.find((id) => id.symbol === 'USDC')
    ?.mint as string;
  
  console.log("About to initialize group...")

  await execCommand(
    `yarn cli init-group ${newGroupName} ${entropyProgramId} ${serumProgramId} ${quoteMint} ${feesVault}`,
  );
  console.log(`new group initialized`);
  for (let i = 0; i < FIXED_IDS.length; i++) {
    const fids = FIXED_IDS[i];
    if (fids.symbol === 'USDC') {
      continue;
    }

    if (!fids.mint) {
      console.log(`adding ${fids.symbol} mint`);
      await execCommand(
        ``, // TODO: Create a function that creates the mint
      );
    }

    console.log(`adding ${fids.symbol} oracle`);
    if (fids.price) {
      await execCommand(`yarn cli add-oracle ${newGroupName} ${fids.symbol}`);
      await execCommand(
        `yarn cli set-oracle ${newGroupName} ${fids.symbol} ${fids.price}`,
      );
    } else {
      await execCommand(
        `yarn cli add-oracle ${newGroupName} ${fids.symbol} --provider ${fids.oracleProvider}`,
      );
    }

    // console.log(`listing and adding ${fids.symbol} spot market`);

    // if (fids.symbol !== "SOL2" && fids.symbol !== 'GVOL7D') {

    //   await execCommand(
    //     `yarn cli add-spot-market ${newGroupName} ${fids.symbol} ${
    //       fids.mint
    //     } --base_lot_size ${fids.baseLot} --quote_lot_size ${
    //       fids.quoteLot
    //     } --init_leverage ${fids.initLeverage || 5} --maint_leverage ${
    //       fids.maintLeverage || 10
    //     } --liquidation_fee ${fids.liquidationFee || 0.05}`,
    //   );
    // }

    if (fids.symbol === 'BTC' || fids.symbol === 'SOL' || fids.symbol === 'SOL2' || fids.symbol === 'GVOL7D' || fids.symbol == 'ETH' || fids.symbol == "BTC_1D_IV" || fids.symbol == "BTC^2") {
      console.log(`adding ${fids.symbol} perp market`);
      await execCommand(
        `yarn cli add-perp-market ${newGroupName} ${
          fids.symbol
        } --init_leverage ${2 * (fids.initLeverage || 5)} --maint_leverage ${
          2 * (fids.maintLeverage || 10)
        } --liquidation_fee ${
          (fids.liquidationFee || 0.05) / 2
        } --base_lot_size ${fids.baseLot} --quote_lot_size ${fids.quoteLot}`,
      );
    }
    console.log('---');
  }
  console.log('Succcessfully created new mango group.');
};

function execCommand(cmd) {
  const exec = require('child_process').exec;
  return new Promise((resolve, _reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

initNewGroup();
