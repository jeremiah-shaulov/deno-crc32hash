# crc32hash
Calculate crc32 hash of a string, Uint8Array, or Deno.Reader.

String:

```ts
import {crc32} from 'https://deno.land/x/crc32hash@v0.0.2/mod.ts';

console.log(crc32('abc'));
```

Uint8Array:

```ts
import {crc32} from 'https://deno.land/x/crc32hash@v0.0.2/mod.ts';

console.log(crc32(new Uint8Array([97, 98, 99])));
```

Deno.Reader:

```ts
import {crc32Reader} from 'https://deno.land/x/crc32hash@v0.0.2/mod.ts';

const filename = new URL(import.meta.url).pathname;
const fp = await Deno.open(filename, {read: true});
try
{	console.log(await crc32Reader(fp));
}
finally
{	fp.close();
}
```
