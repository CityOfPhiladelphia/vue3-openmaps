# vue3-layerboard

A Vue 3 + MapLibre GL JS framework for building interactive map applications with layer management, measurement tools, and ArcGIS integration.

## Features

- **MapLibre GL JS Integration** - Modern, performant vector tile mapping
- **Layer Management** - Dynamic layer loading from ArcGIS Online web maps
- **Measurement Tools** - Interactive area and distance measurement
- **Geolocation** - User location tracking and display
- **Legend & Layer Controls** - Configurable layer visibility and legends
- **Popup System** - Feature identification and attribute display

## Installation

```sh
npm install @phila/layerboard
```

## Peer Dependencies

This package requires the following peer dependencies:

- `vue` ^3.5.0
- `pinia` ^3.0.0
- `maplibre-gl` ^5.0.0
- `@fortawesome/fontawesome-svg-core` ^7.0.0
- `@fortawesome/free-solid-svg-icons` ^7.0.0
- `@fortawesome/vue-fontawesome` ^3.0.0

## Development

### Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```
