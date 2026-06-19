# Deployment

Tanzaku deploys automatically: every push to `main` triggers
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), which syncs the
source to the server and builds it there. nginx serves the built `dist/` over HTTPS.

```
push main → GitHub Actions → rsync source to /opt/tanzaku → ssh: npm ci && npm run build
                                                                          → /opt/tanzaku/dist
nginx serves /opt/tanzaku/dist  at  https://tanzaku.lasseharm.space
```

## Required GitHub repo secrets

| Secret            | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `SSH_PRIVATE_KEY` | Private key whose public key is in the server's `~/.ssh/authorized_keys` for `SSH_USER` |
| `SSH_HOST`        | Server hostname or IP                                |
| `SSH_USER`        | Login user that owns `/opt/tanzaku`                  |

---

## One-time server bootstrap

Run these once on the server (a fresh Debian/Ubuntu host is assumed). They are
**not** part of the pipeline — the deploy user never needs `sudo`.

### 1. Install Node 20 LTS, nginx, certbot

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
```

### 2. Create the app directory, owned by the deploy user

```bash
sudo mkdir -p /opt/tanzaku
sudo chown "$USER":"$USER" /opt/tanzaku   # use the SSH_USER login here
sudo mkdir -p /var/www/certbot            # ACME challenge webroot (for cert renewals)
```

Make sure the public half of `SSH_PRIVATE_KEY` is in this user's
`~/.ssh/authorized_keys`.

### 3. Point DNS at the server

Create an `A` record: `tanzaku.lasseharm.space` → `SSH_HOST`. Wait for it to
resolve before the next step (`dig +short tanzaku.lasseharm.space`).

### 4. Issue the TLS certificate

```bash
sudo certbot certonly --nginx -d tanzaku.lasseharm.space
```

`certonly` issues the cert into `/etc/letsencrypt/live/tanzaku.lasseharm.space/`
without editing your site config, so [`nginx/tanzaku.conf`](nginx/tanzaku.conf)
stays the single source of truth.

### 5. Enable the nginx site

```bash
sudo ln -s /opt/tanzaku/deploy/nginx/tanzaku.conf /etc/nginx/sites-enabled/tanzaku.conf
sudo nginx -t
sudo systemctl reload nginx
```

> The symlink target only exists after the first successful deploy has synced
> the repo to `/opt/tanzaku`. Either trigger a deploy first, or copy the file in
> manually for the initial setup.

### 6. Renewals (automatic)

certbot installs a systemd timer that renews certs automatically. Make sure
renewed certs are picked up by nginx:

```bash
sudo certbot renew --dry-run            # verify renewal works
# reload nginx after each renewal:
echo -e '#!/bin/sh\nsystemctl reload nginx' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

---

## First deploy

Push to `main` (or re-run the workflow). The pipeline rsyncs the source
(excluding `.git`, `node_modules`, `dist`), then runs `npm ci && npm run build`
on the server. A failed `tsc -b`/`vite build` aborts before the old `dist/` is
replaced, so a broken build will not take the live site down.
