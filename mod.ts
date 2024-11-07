/**	Deno module to calculate crc32 hash of a string, Uint8Array or ReadableStream<Uint8Array>.

	This module exports 2 functions and 1 class:

	{@linkcode crc32}

	{@linkcode crc32Stream}

	{@linkcode Crc32}

	#### String:

	```ts
	import {crc32} from 'https://deno.land/x/crc32hash@v2.0.0/mod.ts';

	console.log(crc32('abc'));
	```

	#### Uint8Array:

	```ts
	import {crc32} from 'https://deno.land/x/crc32hash@v2.0.0/mod.ts';

	console.log(crc32(new Uint8Array([97, 98, 99])));
	```

	#### ReadableStream<Uint8Array>:

	```ts
	import {crc32Stream} from 'https://deno.land/x/crc32hash@v2.0.0/mod.ts';

	const fileUrl = new URL(import.meta.url);
	using fp = await Deno.open(fileUrl, {read: true});
	console.log(await crc32Stream(fp.readable));
	```

	#### Data parts

	```ts
	import {crc32, Crc32} from 'https://deno.land/x/crc32hash@v2.0.0/mod.ts';
	import {assertEquals} from 'https://deno.land/std@0.224.0/assert/assert_equals.ts';

	const crc = new Crc32;

	crc.update('Lorem ipsum ');
	assertEquals(crc.value, crc32('Lorem ipsum '));

	crc.update('dolor sit amet');
	assertEquals(crc.value, crc32('Lorem ipsum dolor sit amet'));
	```

	@module
 **/

const encoder = new TextEncoder;
const CRC_TABLE = new Uint32Array(256);

// Init CRC_TABLE
for (let i=0; i<256; i++)
{	let c = i;
	for (let j=0; j<8; j++)
	{	c = c&1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
	}
	CRC_TABLE[i] = c;
}

/**	The work is done here
 **/
function crc32Update(crc: number, data: Uint8Array)
{	for (let i=0, iEnd=data.length; i<iEnd; i++)
	{	crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ data[i]) & 0xFF];
	}
	return crc;
}

/**	Calculate CRC32 hash of a string or a Uint8Array.

	```ts
	import {crc32} from 'https://deno.land/x/crc32hash@v2.0.0/mod.ts';

	console.log(crc32('abc'));
	```
 **/
export function crc32(data: string|Uint8Array)
{	if (typeof(data) == 'string')
	{	data = encoder.encode(data);
	}
	const crc = crc32Update(-1, data);
	return ~crc >>> 0;
}

/**	Reads the provided stream to the end, and returns it's CRC32 hash.

	```ts
	import {crc32Stream} from 'https://deno.land/x/crc32hash@v2.0.0/mod.ts';

	const fileUrl = new URL(import.meta.url);
	using fp = await Deno.open(fileUrl, {read: true});
	console.log(await crc32Stream(fp.readable));
	```
 **/
export async function crc32Stream(stream: ReadableStream<Uint8Array>, bufferSize=8*1024)
{	let byobReader: ReadableStreamBYOBReader|undefined;
	try
	{	byobReader = stream.getReader({mode: 'byob'});
	}
	catch
	{	let crc = -1;
		for await (const chunk of stream)
		{	crc = crc32Update(crc, chunk);
		}
		return ~crc >>> 0;
	}
	try
	{	let buffer = new Uint8Array(bufferSize);
		let crc = -1;
		while (true)
		{	const {value, done} = await byobReader.read(buffer);
			if (done)
			{	return ~crc >>> 0;
			}
			crc = crc32Update(crc, value);
			buffer = new Uint8Array(value.buffer);
		}
	}
	finally
	{	byobReader.releaseLock();
	}
}

/**	To calculate CRC32 hash of data by parts, first create this object,
	then call `update(dataPart)` any number of times, and finally get the hash from `value` property.
	This object also implements `valueOf()` and `toString()`, so can be converted to a number or a string directly.

	```ts
	import {crc32, Crc32} from 'https://deno.land/x/crc32hash@v2.0.0/mod.ts';
	import {assertEquals} from 'https://deno.land/std@0.224.0/assert/assert_equals.ts';

	const crc = new Crc32;

	crc.update('Lorem ipsum ');
	console.log(crc.value);
	assertEquals(crc.value, crc32('Lorem ipsum '));

	crc.update('dolor sit amet');
	console.log(crc.value);
	assertEquals(crc.value, crc32('Lorem ipsum dolor sit amet'));
	```
 **/
export class Crc32
{	#crc = -1;

	/**	Returns the hash of all data parts till now.
	 **/
	get value()
	{	return ~this.#crc >>> 0;
	}

	/**	Add next data part to update the hash.
	 **/
	update(dataPart: string|Uint8Array)
	{	if (typeof(dataPart) == 'string')
		{	dataPart = encoder.encode(dataPart);
		}
		this.#crc = crc32Update(this.#crc, dataPart);
	}

	/**	Like {@link Crc32.value} also returns the hash.
		Javascript will call this function automatically when the object must be converted to a number.

		```ts
		import {Crc32} from './mod.ts';
		import {assertEquals} from 'https://deno.land/std@0.224.0/assert/assert_equals.ts';

		const crc = new Crc32;
		crc.update('Lorem ipsum dolor sit amet');
		assertEquals(+crc, crc.value);
		```
	 **/
	valueOf()
	{	return this.value;
	}

	/**	Returns {@link Crc32.value} as string.

		```ts
		import {Crc32} from './mod.ts';

		const crc = new Crc32;
		crc.update('Lorem ipsum dolor sit amet');
		console.log(`The hash is ${crc}`);
		```
	 **/
	toString()
	{	return this.value+'';
	}
}
