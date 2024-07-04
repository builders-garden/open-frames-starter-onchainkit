import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { validateFrameMessage } from '../../lib/utils';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

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
  

  const title = 'Open Frames - OnchainKit Starter';
  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: 'OnchainKit',
          target: 'https://github.com/builders-garden/open-frames-starter-onchainkit',
        },
        {
          action: 'post',
          label: 'Post',
          target: `${NEXT_PUBLIC_URL}/api/post`,
        },
        {
          action: 'tx',
          label: 'Tx',
          target: `${NEXT_PUBLIC_URL}/api/tx`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
        },
      ],
      isOpenFrame: true,
      accepts: { xmtp: 'vNext' },
      image: {
        src: `${NEXT_PUBLIC_URL}/api/images?title=${title}`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      state: {
        count: state?.count,
        time: new Date().toISOString(),
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
