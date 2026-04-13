# gif-info

Parse completo do header de GIFs: dimensoes, versao, numero de frames, duracao total e loop count.

## Instalacao

```bash
npm install gif-info
```

## Uso

```ts
import { parseGifInfo } from "gif-info";
import { readFileSync } from "fs";

const buf = readFileSync("anim.gif");
const info = parseGifInfo(buf);
console.log(info.frames, info.durationMs, info.width, info.height);
```

## API

- `parseGifInfo(buf: Buffer): GifInfo`

Campos: `version, width, height, frames, durationMs, loopCount`.

## Licenca

MIT
