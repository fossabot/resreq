import { ON_GLOBAL_REQUEST_PROGRESS, ON_GLOBAL_RESPONSE_PROGRESS } from './consts'
import compose from './helper/compose'
import requestHandler from './middleware/requestHandler'
import responseHandler from './middleware/responseHandler'
import timeout from './middleware/timeout'
import Req, { ReqInit } from './Req'
import Res from './Res'

export type Next = (req: Req) => Promise<Res>
export type Middleware = (next: Next) => (req: Req) => Promise<Res>

export interface Options extends Omit<ReqInit, 'body'> {
  body?: BodyInit | Record<string, any>
  baseUrl?: string
  params?: Record<string, any>
  timeout?: number
  throwHttpError?: boolean
}

export default class Resreq {
  options: Options
  middleware: Middleware[] = [requestHandler, timeout, responseHandler]
  constructor(options: Options = {}) {
    this.options = {
      ...options,
      baseUrl: options.baseUrl || '',
      timeout: options.timeout || 10000,
      throwHttpError: options.throwHttpError || false
    }
  }

  use(middleware: Middleware | Middleware[]) {
    /**
     * The response is first handled by the responseHandler
     * so it must be placed last
     */
    const responseHandler = this.middleware.pop()!
    this.middleware = [...this.middleware, ...[middleware].flat(), responseHandler]
    return this
  }

  async request(options: Options): Promise<Res> {
    const dispatch = compose(...this.middleware)
    return dispatch(fetch)({
      ...this.options,
      ...options,
      onRequestProgress: options.onRequestProgress,
      onResponseProgress: options.onResponseProgress,
      [ON_GLOBAL_REQUEST_PROGRESS]: this.options.onRequestProgress,
      [ON_GLOBAL_RESPONSE_PROGRESS]: this.options.onResponseProgress
    })
  }

  async get(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'GET' })
  }

  async post(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'POST' })
  }

  async put(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'PUT' })
  }

  async delete(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'DELETE' })
  }

  async patch(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'PATCH' })
  }

  async head(url: string, options?: Options) {
    return await this.request({ ...options, url, method: 'HEAD' })
  }
}

export { default as Req, ReqInit } from './Req'
export { default as Res, ResInit } from './Res'