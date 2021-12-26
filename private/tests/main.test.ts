import {crc32, crc32Reader} from '../../mod.ts';
import {assertEquals} from "https://deno.land/std@0.117.0/testing/asserts.ts";

class StringReader
{	private data: Uint8Array;
	private pos = 0;
	private state = 0;

	constructor(str: string, private chunkSize=10)
	{	this.data = new TextEncoder().encode(str);
	}

	read(buffer: Uint8Array)
	{	let result: number|null = null;
		if (this.pos < this.data.length)
		{	if (this.state++ % 10 == 0)
			{	result = 0;
			}
			else
			{	const chunk = this.data.subarray(this.pos, this.pos+Math.min(this.chunkSize, this.data.length-this.pos, buffer.length));
				buffer.set(chunk, 0);
				this.pos += chunk.length;
				result = chunk.length;
			}
		}
		return Promise.resolve(result);
	}
}

const REF: [string, number][] =
[	['abc', 891568578],
	['abcde', 2240272485],
	['ф', 858759576],
	["import {crc32, crc32Reader} from '../../mod.ts';", 2081105895],
];

Deno.test
(	'crc32',
	() =>
	{	assertEquals(crc32(''), 0);
		for (const [str, result] of REF)
		{	assertEquals(crc32(str), result);
		}
	}
);

Deno.test
(	'crc32Reader',
	async () =>
	{	for (const [str, result] of REF)
		{	for (let chunkSize=1; chunkSize<str.length; chunkSize++)
			{	assertEquals(await crc32Reader(new StringReader(str, chunkSize)), result);
			}
		}
	}
);
