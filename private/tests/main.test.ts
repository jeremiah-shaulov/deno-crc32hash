import {crc32, crc32Stream, Crc32} from '../../mod.ts';
import {assertEquals} from 'jsr:@std/assert@1.0.7/equals';

const encoder = new TextEncoder;

function stringStreamDefault(str: string, chunkSize=10)
{	const data = encoder.encode(str);
	let pos = 0;
	let state = 0;
	return new ReadableStream<Uint8Array>
	(	{	pull(controller)
			{	if (pos < data.length)
				{	const chunk = state++ % 10 == 0 ? new Uint8Array : data.subarray(pos, pos+Math.min(chunkSize, data.length-pos));
					controller.enqueue(chunk);
					pos += chunk.length;
				}
				else
				{	controller.close();
				}
			}
		}
	);
}

function stringStreamByob(str: string, chunkSize=10)
{	const data = encoder.encode(str);
	let pos = 0;
	return new ReadableStream
	(	{	type: 'bytes',
			pull(controller)
			{	if (pos < data.length)
				{	const limit = controller.byobRequest?.view?.byteLength ?? Number.MAX_SAFE_INTEGER;
					const chunk = data.subarray(pos, pos+Math.min(chunkSize, data.length-pos, limit));
					if (controller.byobRequest?.view)
					{	new Uint8Array(controller.byobRequest.view.buffer).set(chunk);
						controller.byobRequest.respond(chunk.length);
					}
					else
					{	controller.enqueue(chunk);
					}
					pos += chunk.length;
				}
				if (pos >= data.length)
				{	controller.close();
				}
			}
		}
	);
}

const REF: [string, number][] =
[	[	'',
		0,
	],
	[	'abc',
		891568578,
	],
	[	'abcde',
		2240272485,
	],
	[	'ф',
		858759576,
	],
	[	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus dignissim magna non mi ullamcorper, et varius ex pretium. Vestibulum suscipit libero vel enim cursus tempor. Vivamus rutrum, sapien sed sagittis rhoncus, nunc sapien lacinia neque, sit amet sagittis ipsum massa pellentesque nunc. Etiam dictum facilisis tellus vel sagittis. Donec vel bibendum tellus, in finibus quam. Vivamus vitae finibus quam. Quisque tristique ante eget aliquam mollis. Cras diam neque, congue vitae neque a, venenatis pretium lorem. Nunc semper luctus lacinia. Duis id sagittis ex. In malesuada malesuada interdum. Proin consectetur bibendum ligula, egestas suscipit metus lobortis sed. Integer consequat massa vel justo egestas, eget mollis arcu volutpat. Vestibulum dapibus vulputate lorem, eu pellentesque mi placerat eu. Nullam lobortis ultrices enim sed iaculis.',
		2278199155,
	],
];

Deno.test
(	'String',
	() =>
	{	for (const [str, result] of REF)
		{	assertEquals(crc32(str), result);
		}
	}
);

Deno.test
(	'Uint8Array',
	() =>
	{	for (const [str, result] of REF)
		{	assertEquals(crc32(encoder.encode(str)), result);
		}
	}
);

Deno.test
(	'ReadableStream',
	async () =>
	{	for (const [str, result] of REF)
		{	for (let chunkSize=1; chunkSize<str.length; chunkSize++)
			{	assertEquals(await crc32Stream(stringStreamDefault(str, chunkSize)), result);
				assertEquals(await crc32Stream(stringStreamByob(str, chunkSize)), result);
			}
		}
	}
);

Deno.test
(	'Data parts',
	() =>
	{	for (const [str, result] of REF)
		{	for (let chunkSize=1; chunkSize<str.length; chunkSize++)
			{	const crc = new Crc32;
				for (let pos=0; pos<str.length; pos+=chunkSize)
				{	crc.update(str.slice(pos, pos+chunkSize));
				}
				assertEquals(crc.value, result);
			}
		}
	}
);
