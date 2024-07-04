import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { validateFrameMessage } from '../../lib/utils';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

  try {
    await validateFrameMessage(body);
  } catch (e) {
    console.error(e);
    return new NextResponse('Message not valid', { status: 500 });
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Tx: ${body?.untrustedData?.transactionId || '--'}`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/api/images?label=Tx&value=${body?.untrustedData?.transactionId}`,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
