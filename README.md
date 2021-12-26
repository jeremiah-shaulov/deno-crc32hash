# crc32hash
Calculate crc32 hash of a string, Uint8Array, or Deno.Reader.

String:

```ts
import {crc32} from './mod.ts';

console.log(crc32('abc'));
```

Uint8Array:

```ts
import {crc32} from './mod.ts';

console.log(crc32(new Uint8Array([97, 98, 99])));
```

Deno.Reader:

```ts
import {crc32Reader} from './mod.ts';

const fp = await Deno.open(new URL(import.meta.url).pathname, {read: true});
console.log(await crc32Reader(fp));
fp.close();
```
