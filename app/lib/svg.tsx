import { join } from 'path';
import fs from 'fs';
import satori from 'satori';

const fontPath = join(process.cwd(), 'public/fonts', 'Inter-Regular.ttf');
let fontData = fs.readFileSync(fontPath);

export const generateFrameImage = async (data: { label: string; value: string }[]) => {
  return await satori(
    <div
      style={{
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        padding: '3.5rem',
        width: '100%',
        height: '100%',
        alignContent: 'center',
        justifyContent: 'space-around',
      }}
    >
      {data.map((d, index) => (
        <p key={index} style={{ fontSize: '2rem', color: '#000000' }}>
          {d.label !== 'title' ? `${d.label}: ${d.value}` : `${d.value}`}
        </p>
      ))}
    </div>,
    {
      width: 955,
      height: 500,
      fonts: [
        {
          data: fontData,
          name: 'Inter',
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
};
