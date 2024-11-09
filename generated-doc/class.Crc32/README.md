# `class` Crc32

[Documentation Index](../README.md)

```ts
import {Crc32} from "https://deno.land/x/crc32hash@v2.0.1/mod.ts"
```

To calculate CRC32 hash of data by parts, first create this object,
then call `update(dataPart)` any number of times, and finally get the hash from `value` property.
This object also implements `valueOf()` and `toString()`, so can be converted to a number or a string directly.

```ts
import {crc32, Crc32} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';
import {assertEquals} from 'jsr:@std/assert@1.0.7/equals';

const crc = new Crc32;

crc.update('Lorem ipsum ');
console.log(crc.value);
assertEquals(crc.value, crc32('Lorem ipsum '));

crc.update('dolor sit amet');
console.log(crc.value);
assertEquals(crc.value, crc32('Lorem ipsum dolor sit amet'));
```

## This class has

- property [value](#-get-value-number)
- 3 methods:
[update](#-updatedatapart-string--uint8array-void),
[valueOf](#-valueof-number),
[toString](#-tostring-string)


#### 📄 `get` value(): `number`

> Returns the hash of all data parts till now.



#### ⚙ update(dataPart: `string` | Uint8Array): `void`

> Add next data part to update the hash.



#### ⚙ valueOf(): `number`

> Like [Crc32.value](../class.Crc32/README.md#-get-value-number) also returns the hash.
> Javascript will call this function automatically when the object must be converted to a number.
> 
> ```ts
> import {Crc32} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';
> import {assertEquals} from 'jsr:@std/assert@1.0.7/equals';
> 
> const crc = new Crc32;
> crc.update('Lorem ipsum dolor sit amet');
> assertEquals(+crc, crc.value);
> ```



#### ⚙ toString(): `string`

> Returns [Crc32.value](../class.Crc32/README.md#-get-value-number) as string.
> 
> ```ts
> import {Crc32} from 'https://deno.land/x/crc32hash@v2.0.1/mod.ts';
> 
> const crc = new Crc32;
> crc.update('Lorem ipsum dolor sit amet');
> console.log(`The hash is ${crc}`);
> ```



