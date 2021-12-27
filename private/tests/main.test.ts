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
[	['', 0],
	['abc', 891568578],
	['abcde', 2240272485],
	['ф', 858759576],
	[	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dignissim magna non mi ullamcorper, et varius ex pretium. Vestibulum suscipit libero vel enim cursus tempor. Vivamus rutrum, sapien sed sagittis rhoncus, nunc sapien lacinia neque, sit amet sagittis ipsum massa pellentesque nunc. Etiam dictum facilisis tellus vel sagittis. Donec vel bibendum tellus, in finibus quam. Vivamus vitae finibus quam. Quisque tristique ante eget aliquam mollis. Cras diam neque, congue vitae neque a, venenatis pretium lorem. Nunc semper luctus lacinia. Duis id sagittis ex. In malesuada malesuada interdum. Proin consectetur bibendum ligula, egestas suscipit metus lobortis sed. Integer consequat massa vel justo egestas, eget mollis arcu volutpat. Vestibulum dapibus vulputate lorem, eu pellentesque mi placerat eu. Nullam lobortis ultrices enim sed iaculis.',
		2278199155
	],
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
