# `function` crc32Stream

[Documentation Index](../README.md)

```ts
import {crc32Stream} from "https://deno.land/x/crc32hash@v2.0.1/mod.ts"
```

`function` crc32Stream(stream: ReadableStream\<Uint8Array>, bufferSize: `number`=8\*1024): Promise\<`number`>

Reads the provided stream to the end, and returns it's CRC32 hash.

```ts
import {crc32Stream} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';

const fileUrl = new URL(import.meta.url);
using fp = await Deno.open(fileUrl, {read: true});
console.log(await crc32Stream(fp.readable));
```

