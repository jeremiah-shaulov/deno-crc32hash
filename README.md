# crc32hash
Calculate crc32 hash of a string, Uint8Array, or Deno.Reader.

This module exports 2 functions:

```ts
function crc32(value: string | Uint8Array): number;
function crc32Reader(value: Deno.Reader, buffer?: Uint8Array): Promise<number>;
```

**String:**

```ts
import {crc32} from 'https://deno.land/x/crc32hash@v1.0.0/mod.ts';

console.log(crc32('abc'));
```

**Uint8Array:**

```ts
import {crc32} from 'https://deno.land/x/crc32hash@v1.0.0/mod.ts';

console.log(crc32(new Uint8Array([97, 98, 99])));
```

**Deno.Reader:**

```ts
import {crc32Reader} from 'https://deno.land/x/crc32hash@v1.0.0/mod.ts';

const filename = new URL(import.meta.url).pathname;
const fp = await Deno.open(filename, {read: true});
try
{	console.log(await crc32Reader(fp));
}
finally
{	fp.close();
}
```

You can pass your own buffer that will be used during the read process.
By default `crc32Reader()` creates a new 8 KiB buffer.
For repeated operations (but not simultaneous), it'd be more optimal to allocate buffer once, and reuse it.

```ts
const buffer = new Uint8Array(8*1024);
const res1 = await crc32Reader(source1, buffer);
const res2 = await crc32Reader(source2, buffer);
const res3 = await crc32Reader(source3, buffer);
```