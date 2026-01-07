/**
 * Layer Configuration Types
 */

export interface LegendItem {
  type: "fill" | "line" | "circle";
  color: string;
  label: string;
  width?: number;
}

export interface PopupField {
  field: string;
  label: string;
}

export interface PopupConfig {
  title: string;
  fields: PopupField[];
}

export interface LayerConfig {
  id: string;
  title: string;
  type: "fill" | "line" | "circle";
  url: string;
  where?: string;
  opacity: number;
  paint: Record<string, unknown>;
  legend: LegendItem[];
  popup: PopupConfig | null;
}
