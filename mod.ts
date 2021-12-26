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

// The work is done here
function crc32Update(crc: number, value: Uint8Array)
{	for (let i=0, iEnd=value.length; i<iEnd; i++)
	{	crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ value[i]) & 0xFF];
	}
	return crc;
}

/**	Calculate CRC32 hash of a string or a Uint8Array.
 **/
export function crc32(value: string|Uint8Array)
{	if (typeof(value) == 'string')
	{	value = encoder.encode(value);
	}
	const crc = crc32Update(-1, value);
	return ~crc >>> 0;
}

/**	You can pass your own buffer that will be used during the read process.
	By default i will create a new 8kiB buffer.
 **/
export async function crc32Reader(value: Deno.Reader, buffer=new Uint8Array(8*1024))
{	let crc = -1;
	while (true)
	{	const n = await value.read(buffer);
		if (n == null)
		{	return ~crc >>> 0;
		}
		crc = crc32Update(crc, buffer.subarray(0, n));
	}
}
