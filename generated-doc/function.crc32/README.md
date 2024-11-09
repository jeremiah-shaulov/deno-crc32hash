# `function` crc32

[Documentation Index](../README.md)

```ts
import {crc32} from "https://deno.land/x/crc32hash@v2.0.1/mod.ts"
```

`function` crc32(data: `string` | Uint8Array): `number`

Calculate CRC32 hash of a string or a Uint8Array.

```ts
import {crc32} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';

console.log(crc32('abc'));
```

