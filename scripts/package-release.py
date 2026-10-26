"""Package the exact built site, retaining relative paths and verifying every byte."""
from pathlib import Path
import hashlib
import json
import subprocess
import zipfile

root = Path(__file__).resolve().parents[1]
version = json.loads((root / 'package.json').read_text())['version']
revision = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
files = {p.relative_to(root / 'dist').as_posix(): p for p in (root / 'dist').rglob('*') if p.is_file()}
expected = {'index.html': root / 'index.html'}
expected.update({p.relative_to(root).as_posix(): p for p in (root / 'src').rglob('*') if p.is_file()})
if set(files) != set(expected):
    raise SystemExit('Build file list differs from source. Run npm run build first.')
for name, source in expected.items():
    if files[name].read_bytes() != source.read_bytes():
        raise SystemExit(f'Build is stale: {name}. Run npm run build first.')

out = root / 'releases'
out.mkdir(exist_ok=True)
archive = out / 'Timer-private-hosting.zip'
manifest = {name: hashlib.sha256(path.read_bytes()).hexdigest() for name, path in sorted(files.items())}
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
    for name, path in sorted(files.items()):
        bundle.write(path, name)
    for name in ['HOSTING.md', 'ASSETS.md']:
        bundle.write(root / name, name)
    bundle.writestr('VERSION.txt', f'Timer {version}\nSource commit: {revision}\nPrivate hosting by the owner; no deployment performed.\n')
    bundle.writestr('SHA256.json', json.dumps(manifest, indent=2) + '\n')
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    for name, digest in manifest.items():
        assert hashlib.sha256(bundle.read(name)).hexdigest() == digest, name
    assert len(bundle.namelist()) == len(manifest) + 4
checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
(out / 'Timer-private-hosting.sha256').write_text(f'{checksum}  {archive.name}\n')
print(f'Timer {version}: {len(files)} site files verified; {archive.stat().st_size:,} bytes')
print(f'Source commit: {revision}')
print(f'Archive: {archive}')
print(f'SHA256: {checksum}')
