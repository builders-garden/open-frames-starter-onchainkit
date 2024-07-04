import { getFrameMessage } from '@coinbase/onchainkit/frame';
import { getXmtpFrameMessage } from '@coinbase/onchainkit/xmtp';

export const validateFrameMessage = async (body: any) => {
  let message = undefined;
  let state = {
    count: 0,
  };
  let buttonIndex;
  let text;
  if (body.clientProtocol?.startsWith('xmtp@')) {
    const { isValid, message: frameMessage } = await getXmtpFrameMessage(body);
    if (!isValid) {
      throw new Error('Message not valid');
    }
    message = frameMessage;
    buttonIndex = message?.buttonIndex;
    text = message?.inputText;
    try {
      state = JSON.parse(decodeURIComponent(message?.state || ''));
    } catch (e) {
      console.error(e);
      throw e;
    }
  } else {
    const { isValid, message: frameMessage } = await getFrameMessage(body, {
      neynarApiKey: 'NEYNAR_ONCHAIN_KIT',
    });

    if (!isValid) {
      throw new Error('Message not valid');
    }
    message = frameMessage;
    text = buttonIndex = message.button;
    try {
      state = JSON.parse(decodeURIComponent(message.state.serialized));
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  return {
    message,
    state,
    buttonIndex,
    text,
  };
};
