// ZIP แบบ store (ไม่บีบอัด) เขียนเอง - ไม่ต้องพึ่ง library ภายนอก
// รองรับชื่อไฟล์ภาษาไทย (UTF-8 flag)

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

function crc32(bytes: Uint8Array): number {
  let crc = ~0;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (~crc) >>> 0;
}

function u16(n: number): Uint8Array {
  return new Uint8Array([n & 0xff, (n >>> 8) & 0xff]);
}
function u32(n: number): Uint8Array {
  return new Uint8Array([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);
}
function concat(parts: Uint8Array[]): Uint8Array {
  let len = 0;
  for (const p of parts) len += p.length;
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

export function makeZip(entries: ZipEntry[]): Blob {
  const enc = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const e of entries) {
    const nameBytes = enc.encode(e.name);
    const crc = crc32(e.data);
    const size = e.data.length;

    const local = concat([
      u32(0x04034b50), // local file header signature
      u16(20), // version needed
      u16(0x0800), // flag: UTF-8 filename
      u16(0), // compression: store
      u16(0),
      u16(0), // mod time/date
      u32(crc),
      u32(size),
      u32(size),
      u16(nameBytes.length),
      u16(0), // extra length
      nameBytes,
      e.data,
    ]);
    localParts.push(local);

    const central = concat([
      u32(0x02014b50), // central dir signature
      u16(20), // version made by
      u16(20), // version needed
      u16(0x0800), // flag: UTF-8
      u16(0), // compression
      u16(0),
      u16(0), // mod time/date
      u32(crc),
      u32(size),
      u32(size),
      u16(nameBytes.length),
      u16(0), // extra
      u16(0), // comment
      u16(0), // disk start
      u16(0), // internal attrs
      u32(0), // external attrs
      u32(offset), // local header offset
      nameBytes,
    ]);
    centralParts.push(central);

    offset += local.length;
  }

  const centralData = concat(centralParts);
  const eocd = concat([
    u32(0x06054b50), // end of central dir signature
    u16(0), // disk
    u16(0), // disk with central dir
    u16(entries.length),
    u16(entries.length),
    u32(centralData.length),
    u32(offset),
    u16(0), // comment length
  ]);

  const parts = [...localParts, centralData, eocd] as BlobPart[];
  return new Blob(parts, { type: "application/zip" });
}
