import http from 'http'
import { app } from './app'

import { config, logger } from './configs'
import { registerShutdownHandler } from './utils/lifecycles'

let server: http.Server

function startHttpServer(): void {
  logger.info(`Starting HTTP Server on port ${config.server.port}`)
  server = app.listen(config.server.port, () => {
    logger.info('HTTP Server started')
  })
}

function stopHttpServer(): Promise<void> {
  logger.info('Stopping HTTP Server')

  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
      } else {
        resolve(undefined)
      }
    })
  })
}

async function main(): Promise<void> {
  logger.info(`Running in ${config.environment} mode`)

  startHttpServer()
  registerShutdownHandler(stopHttpServer)
}

main()
