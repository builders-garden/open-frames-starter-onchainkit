import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { validateFrameMessage } from '../../lib/utils';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body = await req.json();

  let message = undefined;
  let state = {
    count: 0,
  };
  let buttonIndex;
  let text;

  try {
    const data = await validateFrameMessage(body);
    message = data.message;
    state = data.state;
    buttonIndex = data.buttonIndex;
    text = data.text;
  } catch (e) {
    console.error(e);
    return new NextResponse('Message not valid', { status: 500 });
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'post',
          label: 'Back',
          target: `${NEXT_PUBLIC_URL}/api/frame`,
        },
      ],
      isOpenFrame: true,
      accepts: { xmtp: 'vNext' },
      image: {
        src: `${NEXT_PUBLIC_URL}/api/images?Count=${state?.count}&Your%20Input=${text}&You%20Clicked%20Button=${buttonIndex}`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      state: {
        count: state?.count + 1,
        time: new Date().toISOString(),
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
