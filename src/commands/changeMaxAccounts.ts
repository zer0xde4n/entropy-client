import { Account, Connection } from '@solana/web3.js';
import BN from 'bn.js';
import { EntropyClient } from '../client';
import { GroupConfig } from '../config';

export default async function changeMaxAccounts(
  connection: Connection,
  payer: Account,
  groupConfig: GroupConfig,
  numAccounts: BN,
) {
  const client = new EntropyClient(connection, groupConfig.entropyProgramId);
  await client.changeMaxAccounts(
    groupConfig.publicKey,
    payer,
    numAccounts
  );
}
