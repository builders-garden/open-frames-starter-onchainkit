import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const text = message.input || '';
  const button = message.button || 0;
  let state = {
    page: 0,
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

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
          action: 'post',
          label: 'Post',
          target: `${NEXT_PUBLIC_URL}/api/post`,
        },
      ],
      isOpenFrame: true,
      accepts: { xmtp: 'vNext' },
      image: {
        src: `${NEXT_PUBLIC_URL}/api/images?text=${text}&button=${button}`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      state: {
        page: state?.page + 1,
        time: new Date().toISOString(),
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
