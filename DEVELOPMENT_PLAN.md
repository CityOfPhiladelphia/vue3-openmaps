# vue3-layerboard Architecture

A Vue 3 + MapLibre mapping framework for City of Philadelphia applications. This repo is the new source for `@phila/layerboard` on npm, replacing the legacy Vue 2 codebase.

---

## Framework Vision

**Dual purpose:**
1. **Immediate**: Migrate OpenMaps application to Vue 3 + MapLibre
2. **Long-term**: Publish as `@phila/layerboard` on npm

### What is vue3-layerboard?

A configuration-driven mapping framework that:
- Displays Esri WebMaps using open-source MapLibre GL JS (instead of proprietary Esri APIs)
- Presents layers in a configurable panel (flat list or topic-based accordion)
- Supports layer toggling, legends, popups, and feature interaction
- Shares common mapping components (search, geolocation, basemap controls)

### Framework Consumers

1. **OpenMaps** (atlas.phila.gov) - General purpose mapping portal with flat layer list
2. **StreetSmartPHL** - Streets Department app with topic-based layer organization
3. **CSOcast** - Water Department app for CSO monitoring
4. Other future mapping applications

### Why Separate Repos?

Different teams maintain these applications and don't want to share repositories. Each app has its own repo and uses `@phila/layerboard` as a dependency.

---

## Completed Work

### Runtime Layer Configuration
Layers are fetched and transformed from Esri WebMap JSON at runtime, eliminating the need for pre-generated static config files. The WebMap ID is configurable per application.

### Feature Highlighting
When a user clicks a feature and the popup opens, the feature is highlighted in electric blue with enhanced visibility (+3px larger/thicker). Highlights clear when popup closes or another feature is selected.

### Fill Layer Rendering
Fixed fill layer rendering issues including opacity handling and numeric match values in style expressions.

### Multi-Layer Popup Navigation
Users can cycle through multiple overlapping features at a click point using Previous/Next buttons in the popup. Layer name and feature counter (e.g., "1 of 3") are displayed.

### Layer Data Fetching Optimization
Layers load in parallel instead of sequentially. Only newly-visible layers are fetched when toggling (existing layers don't re-fetch).

---

## Future Work

See `bd list` for active issues. Major items include:
- Keyboard navigation for popups
- Mobile layout improvements
- Framework documentation and npm publishing
- Consumer app migrations

---

## Architecture

### Panel Modes

**Flat layer list** (OpenMaps style):
- `layerFilter: true` enables layer search/filter
- All layers in a searchable, scrollable list

**Topics accordion** (StreetSmartPHL style):
- `defaultPanel: 'topics'` enables topic-based UI
- Topics are Vue components (e.g., `PaveTopic.vue`), not config objects
- Each topic contains layer toggles, info boxes, legends

### Key Architectural Decision: Vue-Idiomatic Approach

The old `@phila/layerboard` used a config-driven component system with problems:
- Configuration as code - mixes data with logic, hard to type-check
- Reinvents Vue - custom `components` array with `type: "paragraph"` instead of Vue components
- Function slots everywhere - loses Vue reactivity benefits
- String component references - breaks tree-shaking and type safety

**Decision: Do NOT maintain backwards compatibility with old config system.**

Instead, use Vue-idiomatic patterns:
- Topics are Vue components that compose framework building blocks
- Framework provides reusable components with typed props
- Data sources use Vue composables with proper reactivity

Tradeoff accepted: StreetSmartPHL needed significant rewriting, but the result is clearer, more maintainable code with better TypeScript and Vue DevTools support.

### Framework Components

**Reusable Vue Components:**
- `<LayerCheckboxSet>` - Toggle multiple layers with legend and opacity options
- `<TopicAccordion>` - Expandable accordion container for topics
- `<DataTable>` - Display tabular data from data sources
- `<InfoBox>` - Styled information/alert container
- `<PopoverLink>` - Links that open popovers with additional content

**Vue Composables:**
- `useDataSource(config)` - Fetch from ArcGIS FeatureServer with Vue reactivity
- `useLayerboard(config)` - Main framework composable for initialization

### Directory Structure

```
vue3-layerboard/
├── src/                        # Framework source code
│   ├── components/
│   │   ├── LayerPanel.vue
│   │   ├── MapPanel.vue
│   │   └── index.ts
│   ├── composables/
│   │   └── index.ts
│   ├── services/
│   │   └── layerConfigService.ts
│   ├── utils/
│   │   └── webmap-transformer.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts                # Main package exports
├── examples/
│   ├── openmaps/               # OpenMaps example app
│   └── streetsmartphl/         # StreetSmartPHL example app
└── package.json
```

### Dependencies

**Peer dependencies:**
- `@phila/phila-ui-map-core` - Map components (MapLibreMap, etc.)
- `@phila/phila-ui-core` - UI components and utilities
- `maplibre-gl` - Map library
- `vue` - Framework

### App-Specific vs Framework Code

**Framework** (in the package):
- `components/LayerPanel.vue`, `MapPanel.vue`
- `services/layerConfigService.ts`
- `utils/webmap-transformer.ts`
- Type definitions

**App-specific** (in consumer repos):
- `App.vue` - Layout and configuration
- `main.ts` - App initialization
- `assets/` - Styles and branding
- Topic components (for StreetSmartPHL-style apps)
