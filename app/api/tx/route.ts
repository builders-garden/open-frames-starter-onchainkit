import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther, parseUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { BUY_MY_COFFEE_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { validateFrameMessage } from '../../lib/utils';
import { erc20Abi } from '../../_contracts/erc20-abi';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  let address;
  try {
    const data = await validateFrameMessage(body);
    address = data.address;
  } catch (e) {
    console.error(e);
    return new NextResponse('Message not valid', { status: 500 });
  }

  // Prepare amount to transfer
  const amount = BigInt(parseUnits('1', 6));

  // Transfering 1 USDC to yourself
  const calldata = encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [address as `0x${string}`, amount] as const,
  });

  const BASE_SEPOLIA_USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: erc20Abi,
      data: calldata,
      to: BASE_SEPOLIA_USDC_ADDRESS,
      value: '0',
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
