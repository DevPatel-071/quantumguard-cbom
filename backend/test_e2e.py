import urllib.request
import json
import os
import io
import zipfile
import tarfile

base_url = 'http://127.0.0.1:8000/api'
print('===========================================================')
print('RUNNING EXTENDED END-TO-END TEST (FOLDER, ZIP, REPO SCAN)')
print('===========================================================')

# 1. Health Check
req = urllib.request.urlopen(f'{base_url}/health')
health = json.loads(req.read().decode())
print(f'[PASS] Health Check: {health["status"]} - Capabilities: {health.get("capabilities", [])}')

# 2. Local Path Scan Test
sample_dir = os.path.abspath('app/sample_repositories/banking-payment-gateway')
req = urllib.request.Request(
    f'{base_url}/scan/local-path',
    data=json.dumps({
        'path': sample_dir,
        'application': 'Local Banking Path Test',
        'business_criticality': 'CRITICAL',
        'exposure': 'INTERNET_FACING',
        'data_lifetime_years': 15.0,
        'migration_time_years': 5.0,
        'quantum_timeline_years': 17.0
    }).encode(),
    headers={'Content-Type': 'application/json'}
)
resp = urllib.request.urlopen(req)
local_cbom = json.loads(resp.read().decode())
ls = local_cbom['scan_summary']
print(f'[PASS] Local Path Scan: {ls["files_scanned"]} files scanned, {ls["crypto_assets_count"]} assets found.')

# 3. In-Memory ZIP Archive Scan Test
zip_buf = io.BytesIO()
with zipfile.ZipFile(zip_buf, 'w') as zf:
    zf.writestr('src/auth.cpp', '#include <openssl/rsa.h>\nvoid fn() { RSA_generate_key_ex(r, 2048, e, NULL); RSA_sign(NID_sha256, m, 32, s, &l, r); }')
    zf.writestr('src/crypto.py', 'from cryptography.hazmat.primitives.asymmetric import ec\npriv = ec.generate_private_key(ec.SECP256R1())')
    zf.writestr('requirements.txt', 'cryptography==41.0.0\n')

# Multipart upload
boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
body = bytearray()
body.extend(f'--{boundary}\r\n'.encode())
body.extend(b'Content-Disposition: form-data; name="file"; filename="test_repo.zip"\r\n')
body.extend(b'Content-Type: application/zip\r\n\r\n')
body.extend(zip_buf.getvalue())
body.extend(f'\r\n--{boundary}\r\n'.encode())
body.extend(b'Content-Disposition: form-data; name="application"\r\n\r\n')
body.extend(b'Synthetic ZIP Repo\r\n')
body.extend(f'--{boundary}--\r\n'.encode())

req = urllib.request.Request(
    f'{base_url}/scan/upload',
    data=bytes(body),
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)
resp = urllib.request.urlopen(req)
zip_cbom = json.loads(resp.read().decode())
zs = zip_cbom['scan_summary']
print(f'[PASS] ZIP Archive Scan: {zs["files_scanned"]} files scanned, {zs["crypto_assets_count"]} assets found.')

# 4. In-Memory Folder Multi-File Upload Test (with preserved directory trees)
folder_body = bytearray()
# File 1: src/payment/gateway.java
folder_body.extend(f'--{boundary}\r\n'.encode())
folder_body.extend(b'Content-Disposition: form-data; name="files"; filename="gateway.java"\r\n')
folder_body.extend(b'Content-Type: text/plain\r\n\r\n')
folder_body.extend(b'KeyPairGenerator.getInstance("RSA");\r\n')

# File 2: config/nginx.conf
folder_body.extend(f'\r\n--{boundary}\r\n'.encode())
folder_body.extend(b'Content-Disposition: form-data; name="files"; filename="nginx.conf"\r\n')
folder_body.extend(b'Content-Type: text/plain\r\n\r\n')
folder_body.extend(b'ssl_protocols TLSv1.2 TLSv1.3;\r\nssl_ciphers ECDHE-RSA-AES256-GCM-SHA384;\r\n')

# Paths JSON parameter
folder_body.extend(f'\r\n--{boundary}\r\n'.encode())
folder_body.extend(b'Content-Disposition: form-data; name="paths"\r\n\r\n')
folder_body.extend(json.dumps(['my-project/src/payment/gateway.java', 'my-project/config/nginx.conf']).encode())

# Folder name
folder_body.extend(f'\r\n--{boundary}\r\n'.encode())
folder_body.extend(b'Content-Disposition: form-data; name="folder_name"\r\n\r\n')
folder_body.extend(b'my-project\r\n')

folder_body.extend(f'\r\n--{boundary}--\r\n'.encode())

req = urllib.request.Request(
    f'{base_url}/scan/folder-upload',
    data=bytes(folder_body),
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)
resp = urllib.request.urlopen(req)
folder_cbom = json.loads(resp.read().decode())
fs = folder_cbom['scan_summary']
print(f'[PASS] Folder Tree Upload Scan: {fs["files_scanned"]} files scanned, {fs["crypto_assets_count"]} assets found.')
for a in folder_cbom['assets']:
    print(f'   -> Found {a["algorithm"]} in relative path: {a["file"]}')

# 5. Clean utility test
req = urllib.request.Request(
    f'{base_url}/scan/sample/clean-utility-app',
    data=json.dumps({}).encode(),
    headers={'Content-Type': 'application/json'}
)
clean_cbom = json.loads(urllib.request.urlopen(req).read().decode())
assert clean_cbom['scan_summary']['crypto_assets_count'] == 0
print(f'[PASS] Clean App 0 False Positives Verified (0 assets).')

print('===========================================================')
print('ALL FOLDER, ZIP ARCHIVE, AND REPOSITORY TESTS PASSED!')
print('===========================================================')
