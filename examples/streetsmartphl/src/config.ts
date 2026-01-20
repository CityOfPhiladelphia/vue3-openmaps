import type { LayerboardConfig } from '../../../src/types'

export const config: LayerboardConfig = {
  webMapId: 'YOUR_STREETSMARTPHL_WEBMAP_ID',
  mode: 'dynamic',
  panelMode: 'topics',
  topics: [
    {
      id: 'pave',
      title: 'Paving',
      layerIds: [], // TODO: Add layer IDs
      defaultExpanded: false,
    },
    {
      id: 'plow',
      title: 'Snow Plowing',
      layerIds: [], // TODO: Add layer IDs
      defaultExpanded: false,
    },
  ],
}
