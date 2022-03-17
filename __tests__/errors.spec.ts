import { test, describe, expect } from 'vitest'
import Server from './helper/Server'
import Resreq from '../src'

describe('Test errors', () => {
  test('Http error with 500', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl, throwHttpError: true })

    server.get('/api', (ctx) => {
      ctx.status = 500
    })

    await expect(resreq.get('/api')).rejects.toThrowError(/500/)

    server.close()
  })

  test('Http error with 404', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl, throwHttpError: true })

    await expect(resreq.get('/404')).rejects.toThrowError(/404/)

    server.close()
  })

  test('Http error with connect', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    await expect(resreq.get('/', { baseUrl: 'https://localhost' })).rejects.toThrowError(/connect/)

    server.close()
  })

  test('Fetch error with url', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    await expect(resreq.get('/', { baseUrl: '/http' })).rejects.toThrowError(/Invalid URL/)

    server.close()
  })

  test('Fetch error with get', async () => {
    const server = new Server()
    const { origin: baseUrl } = await server.listen()
    const resreq = new Resreq({ baseUrl })

    await expect(resreq.get('/', { body: {} })).rejects.toThrowError(/cannot have body/)

    server.close()
  })
})
