# Tanzaku Deployment Pipeline — Design

**Date:** 2026-06-19
**Status:** Approved

## Goal

Continuous deployment of the Tanzaku Vite + React SPA to a self-managed server,
served over HTTPS at `tanzaku.lasseharm.space`.

## Constraints / Inputs

- GitHub repo secrets available: `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER`.
- App lives under its own directory: `/opt/tanzaku`.
- Must serve at `tanzaku.lasseharm.space` over SSL.
- Build happens **on the server** (per decision).
- Server is treated as **fresh** — nginx + SSL are one-time manual bootstrap.
- Deploy trigger: **push to `main`**.

## Architecture

```
push to main
   └─> GitHub Actions (deploy.yml)
         ├─ checkout
         ├─ load SSH_PRIVATE_KEY into ssh-agent
         ├─ ssh-keyscan SSH_HOST -> known_hosts
         ├─ rsync -az --delete  (exclude .git, node_modules, dist)  ->  SSH_USER@SSH_HOST:/opt/tanzaku
         └─ ssh: cd /opt/tanzaku && npm ci && npm run build
                                                  └─> writes /opt/tanzaku/dist
nginx (one-time configured) serves /opt/tanzaku/dist over HTTPS
```

## Components

### 1. `.github/workflows/deploy.yml`
- Trigger: `push` to `main`.
- Single `deploy` job on `ubuntu-latest`.
- Steps: checkout → start ssh-agent with `SSH_PRIVATE_KEY` → `ssh-keyscan` host into `known_hosts`
  → `rsync -az --delete --exclude` source to `/opt/tanzaku` → `ssh` run `npm ci && npm run build`.
- `node_modules` excluded from rsync so server-side installed deps persist; `npm ci` keeps them in sync with the lockfile.
- Pipeline never uses `sudo`.

### 2. `deploy/nginx/tanzaku.conf`
- `:80` server → 301 redirect to HTTPS (plus ACME challenge location for renewals).
- `:443 ssl` server:
  - `root /opt/tanzaku/dist;`
  - `try_files $uri $uri/ /index.html;` (react-router SPA fallback).
  - Certs from `/etc/letsencrypt/live/tanzaku.lasseharm.space/`.
  - Modern TLS, gzip, long-cache headers for hashed assets, no-cache for `index.html`.

### 3. `deploy/README.md`
One-time server bootstrap (manual, run once):
1. Install Node 20 LTS, nginx, certbot + `python3-certbot-nginx`.
2. `sudo mkdir -p /opt/tanzaku && sudo chown $SSH_USER /opt/tanzaku`.
3. Point DNS `tanzaku.lasseharm.space` → `SSH_HOST`.
4. `sudo certbot certonly --nginx -d tanzaku.lasseharm.space` (issues cert; our config stays authoritative).
5. Symlink `tanzaku.conf` into `/etc/nginx/sites-enabled/`, `sudo nginx -t`, `sudo systemctl reload nginx`.
6. certbot systemd timer auto-renews; renewal reload via deploy hook.

## Assumptions (confirmed)
- `SSH_USER` can write `/opt/tanzaku` without sudo (set via one-time `chown`).
- DNS points to `SSH_HOST` before the certbot step is run.

## Tradeoffs
- Build-on-server requires Node on the host and means a failed build runs against the live tree;
  `tsc -b` failing aborts before `vite build` clears `dist/`, so the live site is not wiped by a broken build.
- nginx/SSL are manual one-time steps, keeping the deploy SSH user unprivileged.
