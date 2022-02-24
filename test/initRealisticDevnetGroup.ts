/**
 * How to use:
 * 1.) Update the mango group name on line 7
 * 2.) Run yarn launch-realistic-group
 * 3.) Update the mango group name in keeper.ts crank.ts and in the UI in useMangoStore.ts
 */


const newGroupName = 'devnet.2';
const mangoProgramId = '4AFs3w5V5J9bDLEcNMEobdG3W4NYmXFgTe4KS41HBKqa';
const serumProgramId = 'DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY';
const feesVault = '7xxohuHBfqDH1aAtMmrepkSDBA4RpHNG77weJw22ebBh'; // devnet vault owned by thiccy

const FIXED_IDS: any[] = [
  {
    symbol: 'USDC',
    decimals: 6,
    mint: 'EDAgjAqGP39wRLZ4yqWJyNb1AExbzcvX12zNe9b89b9G',
  },
  {
    symbol: 'BTC',
    decimals: 6,
    baseLot: 100,
    quoteLot: 10,
    oracleProvider: 'switchboard',
    mint: '3UNBZ6o52WTWwjac2kPUb4FyodhU1vFkRJheu1Sh2TvU',
  },
  {
    symbol: 'ETH',
    decimals: 6,
    baseLot: 100,
    quoteLot: 10,
    oracleProvider: 'pyth',
    mint: 'Cu84KB3tDL6SbFgToHMLYVDJJXdJjenNzSKikeAvzmkA',
  },
  {
    symbol: 'SOL',
    decimals: 9,
    baseLot: 10000,
    quoteLot: 100,
    oracleProvider: 'switchboard',
    mint: 'So11111111111111111111111111111111111111112',
  },
  {
    symbol: 'SOL2',
    decimals: 6,
    baseLot: 100,
    quoteLot: 10,
    oracleProvider: 'switchboard',
    oracle: "83jN7eN5wUBsTAZ7tMrmpQxw6qQfTD8FrpuYS32hZBqT",
    mint: '5B25p1NgAZYLS7gPg6qd2d7s8gANt6749ASSiTXL38Uv',
    initLeverage: 1.25,
    maintLeverage: 2.5,
    liquidationFee: 0.10,
  },
  {
    symbol: 'GVOL7D',
    decimals: 9,
    baseLot: 10000,
    quoteLot: 100,
    oracleProvider: 'switchboard',
    oracle: "CX1PvW4qUDy4PPq8egnMVCbVJt8TcPCt7WCZuwmvCfo7",
    mint: '5B25p1NgAZYLS7gPg6qd2d7s8gANt6749ASSiTXL38Uv',
    initLeverage: 1.25,
    maintLeverage: 2.5,
    liquidationFee: 0.10,
  }
];

const initNewGroup = async () => {
  // const connection: Connection = Test.createDevnetConnection();
  // const mints = IDS.filter((id) => id.symbol !== 'USDC').map((id) => id.mint);
  console.log('starting');
  const quoteMint = FIXED_IDS.find((id) => id.symbol === 'USDC')
    ?.mint as string;
  
  console.log("YEA WE'RE ABOUT TO INITIALIZE THE GROUP")

  await execCommand(
    `yarn cli init-group ${newGroupName} ${mangoProgramId} ${serumProgramId} ${quoteMint} ${feesVault}`,
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

    if (fids.symbol === 'BTC' || fids.symbol === 'SOL' || fids.symbol === 'SOL2' || fids.symbol === 'GVOL7D' || fids.symbol == 'ETH') {
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
