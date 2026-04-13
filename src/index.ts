export interface GifInfo {
  version: '87a' | '89a';
  width: number;
  height: number;
  frames: number;
  /** Total animation duration in milliseconds (sum of frame delays) */
  durationMs: number;
  loopCount: number | null;
}

export function parseGifInfo(buf: Buffer): GifInfo {
  if (buf.length < 13) throw new Error('Buffer too short to be a GIF');
  const sig = buf.slice(0, 6).toString('ascii');
  if (sig !== 'GIF87a' && sig !== 'GIF89a') throw new Error('Not a GIF file');
  const version = sig.slice(3) as '87a' | '89a';
  const width = buf.readUInt16LE(6);
  const height = buf.readUInt16LE(8);
  const packed = buf[10];
  const hasGCT = (packed & 0x80) !== 0;
  const gctSize = hasGCT ? 3 * (1 << ((packed & 0x07) + 1)) : 0;

  let p = 13 + gctSize;
  let frames = 0;
  let durationMs = 0;
  let loopCount: number | null = null;
  let pendingDelay = 0;

  const skipSubBlocks = (start: number): number => {
    let pos = start;
    while (pos < buf.length) {
      const size = buf[pos];
      pos += 1;
      if (size === 0) break;
      pos += size;
    }
    return pos;
  };

  while (p < buf.length) {
    const b = buf[p];
    if (b === 0x3b) break;
    if (b === 0x21) {
      const label = buf[p + 1];
      if (label === 0xf9) {
        const blockSize = buf[p + 2];
        pendingDelay = buf.readUInt16LE(p + 4) * 10;
        p += 3 + blockSize + 1;
      } else if (label === 0xff) {
        const blockSize = buf[p + 2];
        const id = buf.slice(p + 3, p + 3 + blockSize).toString('ascii');
        const subStart = p + 3 + blockSize;
        if (id.startsWith('NETSCAPE2.0') && buf[subStart] === 3) {
          loopCount = buf.readUInt16LE(subStart + 2);
        }
        p = skipSubBlocks(subStart);
      } else {
        const blockSize = buf[p + 2];
        p = skipSubBlocks(p + 3 + blockSize);
      }
    } else if (b === 0x2c) {
      frames++;
      durationMs += pendingDelay;
      pendingDelay = 0;
      const imgPacked = buf[p + 9];
      const hasLCT = (imgPacked & 0x80) !== 0;
      const lctSize = hasLCT ? 3 * (1 << ((imgPacked & 0x07) + 1)) : 0;
      const dataStart = p + 10 + lctSize + 1;
      p = skipSubBlocks(dataStart);
    } else {
      break;
    }
  }

  return { version, width, height, frames, durationMs, loopCount };
}
