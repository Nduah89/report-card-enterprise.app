from pathlib import Path
import base64
import gzip
import hashlib

HERE = Path(__file__).resolve().parent
encoded = (HERE / "index.ts.gz.b64").read_text(encoding="utf-8").strip()
source = gzip.decompress(base64.b64decode(encoded))
expected = "fd56a61a330e323083427467b9ff17f8e055d747a33d8da539718c74c99e062a"
actual = hashlib.sha256(source).hexdigest()
if actual != expected:
    raise SystemExit(f"r35 scheduled-backup source SHA mismatch: {actual}")
(HERE / "index.ts").write_bytes(source)
print(f"reconstructed index.ts: {len(source)} bytes, sha256={actual}")
