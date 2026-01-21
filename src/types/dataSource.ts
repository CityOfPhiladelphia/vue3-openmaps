/**
 * DataSource Types
 *
 * Configuration and state types for fetching external data from APIs.
 * Used by topic components to display dynamic content like notices, status, etc.
 */

/**
 * Configuration for a data source
 */
export interface DataSourceConfig {
  /** Unique identifier for the data source */
  id: string
  /** URL to fetch data from */
  url: string
  /** Type of data source - determines how data is fetched */
  type: 'http-get' | 'http-post' | 'esri'
  /** Optional polling interval in milliseconds (for auto-refresh) */
  pollInterval?: number
  /** Optional request options (headers, etc.) */
  options?: RequestInit
  /** Optional transform function to process the response data */
  transform?: (data: unknown) => unknown
}

/**
 * State for a single data source
 */
export interface DataSourceState<T = unknown> {
  /** The fetched data (null if not yet loaded or error) */
  data: T | null
  /** Whether the data is currently being fetched */
  loading: boolean
  /** Error message if fetch failed */
  error: string | null
  /** Timestamp of last successful fetch */
  lastFetched: number | null
}

/**
 * Combined state for all data sources
 */
export type DataSourcesState = Record<string, DataSourceState>
