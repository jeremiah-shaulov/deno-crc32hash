<!--
	This file is generated with the following command:
	deno run --allow-all https://raw.githubusercontent.com/jeremiah-shaulov/tsa/v0.0.33/tsa.ts doc-md --outFile=README.md mod.ts --mainTitle crc32hash --outUrl https://raw.githubusercontent.com/jeremiah-shaulov/deno-crc32hash/v2.0.1/README.md --importUrl https://deno.land/x/crc32hash@v2.0.1/mod.ts
-->

# crc32hash

[Documentation Index](generated-doc/README.md)

Deno module to calculate crc32 hash of a string, Uint8Array or ReadableStream<Uint8Array>.

This module exports 2 functions and 1 class:

> `function` [crc32](generated-doc/function.crc32/README.md)(data: `string` | Uint8Array): `number`

> `function` [crc32Stream](generated-doc/function.crc32Stream/README.md)(stream: ReadableStream\<Uint8Array>, bufferSize: `number`=8\*1024): Promise\<`number`>

> `class` Crc32<br>
> {<br>
> &nbsp; &nbsp; 📄 `get` [value](generated-doc/class.Crc32/README.md#-get-value-number)(): `number`<br>
> &nbsp; &nbsp; ⚙ [update](generated-doc/class.Crc32/README.md#-updatedatapart-string--uint8array-void)(dataPart: `string` | Uint8Array): `void`<br>
> &nbsp; &nbsp; ⚙ [valueOf](generated-doc/class.Crc32/README.md#-valueof-number)(): `number`<br>
> &nbsp; &nbsp; ⚙ [toString](generated-doc/class.Crc32/README.md#-tostring-string)(): `string`<br>
> }

#### String:

```ts
import {crc32} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';

console.log(crc32('abc'));
```

#### Uint8Array:

```ts
import {crc32} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';

console.log(crc32(new Uint8Array([97, 98, 99])));
```

#### ReadableStream<Uint8Array>:

```ts
import {crc32Stream} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';

const fileUrl = new URL(import.meta.url);
using fp = await Deno.open(fileUrl, {read: true});
console.log(await crc32Stream(fp.readable));
```

#### Data parts

```ts
import {crc32, Crc32} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';
import {assertEquals} from 'jsr:@std/assert@1.0.7/equals';

const crc = new Crc32;

crc.update('Lorem ipsum ');
assertEquals(crc.value, crc32('Lorem ipsum '));

crc.update('dolor sit amet');
assertEquals(crc.value, crc32('Lorem ipsum dolor sit amet'));
```