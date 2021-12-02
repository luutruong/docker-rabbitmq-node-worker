export interface WorkerOptions {
  maxRetries?: number
  retryKey?: string
  queue: string
}

export interface ApiPublishBody {
  url: string
  delay_ms?: number | string
}
