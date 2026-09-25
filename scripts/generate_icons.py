"""Generate the local PWA PNG icons with only Python's standard library."""
from pathlib import Path
import struct
import zlib


ROOT = Path(__file__).resolve().parents[1] / "assets" / "icons"


def png_chunk(name, payload):
    return struct.pack(">I", len(payload)) + name + payload + struct.pack(">I", zlib.crc32(name + payload) & 0xFFFFFFFF)


def render(size):
    green = (21, 61, 56, 255)
    cream = (243, 234, 214, 255)
    gold = (211, 173, 109, 255)
    pixels = bytearray(green * (size * size))

    def dot(x, y, color):
        if 0 <= x < size and 0 <= y < size:
            i = (y * size + x) * 4
            pixels[i:i + 4] = bytes(color)

    def disk(cx, cy, r, color):
        for y in range(max(0, cy - r), min(size, cy + r + 1)):
            for x in range(max(0, cx - r), min(size, cx + r + 1)):
                if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                    dot(x, y, color)

    def thick_line(x1, y1, x2, y2, width, color):
        steps = max(abs(x2 - x1), abs(y2 - y1)) + 1
        for i in range(steps + 1):
            x = round(x1 + (x2 - x1) * i / steps)
            y = round(y1 + (y2 - y1) * i / steps)
            disk(x, y, width // 2, color)

    s = size / 512
    q = lambda v: round(v * s)
    thick_line(q(116), q(422), q(396), q(422), q(24), cream)
    thick_line(q(145), q(422), q(145), q(354), q(22), cream)
    thick_line(q(367), q(422), q(367), q(354), q(22), cream)
    thick_line(q(145), q(354), q(367), q(354), q(22), cream)
    for y in range(q(273), q(347)):
        left = round(q(163) - (y - q(273)) * .23)
        right = round(q(349) + (y - q(273)) * .23)
        for x in range(left, right):
            dot(x, y, gold)
    thick_line(q(163), q(270), q(349), q(270), q(12), cream)
    thick_line(q(145), q(354), q(163), q(270), q(12), cream)
    thick_line(q(367), q(354), q(349), q(270), q(12), cream)
    thick_line(q(256), q(352), q(256), q(90), q(24), cream)
    thick_line(q(192), q(132), q(320), q(132), q(24), cream)
    thick_line(q(180), q(205), q(332), q(205), q(24), cream)
    disk(q(148), q(431), q(28), cream)
    disk(q(364), q(431), q(28), cream)
    raw = b"".join(b"\0" + pixels[y * size * 4:(y + 1) * size * 4] for y in range(size))
    header = b"\x89PNG\r\n\x1a\n"
    body = png_chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    body += png_chunk(b"IDAT", zlib.compress(raw, 9))
    body += png_chunk(b"IEND", b"")
    return header + body


if __name__ == "__main__":
    ROOT.mkdir(parents=True, exist_ok=True)
    for size in (180, 192, 512):
        (ROOT / f"icon-{size}.png").write_bytes(render(size))
