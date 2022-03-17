import { ON_GLOBAL_REQUEST_PROGRESS, ON_GLOBAL_RESPONSE_PROGRESS } from './consts'

export interface ResInit extends ResponseInit {
  onRequestProgress?: ProgressCallback
  onResponseProgress?: ProgressCallback
  abortController: AbortController
  [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback
  [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
}

export default class Res extends Response {
  readonly abortController: AbortController
  readonly onRequestProgress?: ProgressCallback
  readonly onResponseProgress?: ProgressCallback;
  readonly [ON_GLOBAL_REQUEST_PROGRESS]?: ProgressCallback;
  readonly [ON_GLOBAL_RESPONSE_PROGRESS]?: ProgressCallback
  constructor(response: Res, init: ResInit) {
    super(response.body, {
      status: init?.status ?? response.status,
      statusText: init?.statusText ?? response.statusText,
      headers: init?.headers ?? response.headers
    })

    this.onRequestProgress = init?.onRequestProgress ?? response.onRequestProgress
    this.onResponseProgress = init?.onResponseProgress ?? response.onResponseProgress
    this[ON_GLOBAL_REQUEST_PROGRESS] = init?.[ON_GLOBAL_REQUEST_PROGRESS] ?? response[ON_GLOBAL_REQUEST_PROGRESS]
    this[ON_GLOBAL_RESPONSE_PROGRESS] = init?.[ON_GLOBAL_RESPONSE_PROGRESS] ?? response[ON_GLOBAL_RESPONSE_PROGRESS]
    this.abortController = init.abortController
  }
}