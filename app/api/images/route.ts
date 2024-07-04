import sharp from 'sharp';
import { generateFrameImage } from '../../lib/svg';

export const GET = async (req: Request, res: Response) => {
  const { searchParams } = new URL(req.url);

  // search params from obj to array of type {label: string, value: string}
  const params = Array.from(searchParams).map(([label, value]) => ({ label, value }));
  const svg = await generateFrameImage(params);

  // Convert SVG to PNG using Sharp
  const pngBuffer = await sharp(Buffer.from(svg)).toFormat('png').toBuffer();

  // Set the content type to PNG and send the response
  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'max-age=10',
    },
  });
};

export const dynamic = 'force-dynamic';
