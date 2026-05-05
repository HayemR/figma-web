# figma-web

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

## Backend API (Python + SQLite)

```sh
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

## Production (Bundled Frontend + Backend)

Build the frontend once, then run only the Python server to serve both API and UI.

```sh
pnpm install
pnpm build

cd backend
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

### Auto-start on a VPS (systemd)

Create a service at `/etc/systemd/system/figma-web.service`:

```ini
[Unit]
Description=Figma Web (FastAPI + bundled Vite build)
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/figma-web
ExecStart=/path/to/figma-web/.venv/bin/uvicorn app:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

Then enable and start it:

```sh
sudo systemctl daemon-reload
sudo systemctl enable figma-web
sudo systemctl start figma-web
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```
