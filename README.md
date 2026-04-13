[![CI](https://img.shields.io/github/actions/workflow/status/Tox1469/gif-info/ci.yml?style=flat-square&label=ci)](https://github.com/Tox1469/gif-info/actions)
[![License](https://img.shields.io/github/license/Tox1469/gif-info?style=flat-square)](LICENSE)
[![Release](https://img.shields.io/github/v/release/Tox1469/gif-info?style=flat-square)](https://github.com/Tox1469/gif-info/releases)
[![Stars](https://img.shields.io/github/stars/Tox1469/gif-info?style=flat-square)](https://github.com/Tox1469/gif-info/stargazers)

---

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