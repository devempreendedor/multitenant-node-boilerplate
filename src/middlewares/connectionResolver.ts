import { createNamespace } from 'continuation-local-storage'
import { NextFunction, Request, Response } from 'express'
import { logger } from '../configs'
import {
  getConnectionByTenant,
  getAdminConnection,
} from '../database/connectionManager'

const nameSpace = createNamespace('unique context')

const resolveTenant = (req: Request, res: Response, next: NextFunction) => {
  const tenant = req.headers.tenant as string

  if (!tenant) {
    return res
      .status(500)
      .json({ error: `Please provide tenant's name to connect` })
  }

  // Run the application in the defined namespace. It will contextualize every underlying function calls.
  nameSpace.run(() => {
    const tenantDbConnection = getConnectionByTenant(tenant)
    logger.info(
      'resolveTenant tenantDbConnection',
      tenantDbConnection && tenantDbConnection.name
    )
    nameSpace.set('connection', tenantDbConnection)
    next()
  })
}

/**
 * Get the admin db connection instance and set it to the current context.
 */
const setAdminDb = (req: Request, res: Response, next: NextFunction) => {
  // Run the application in the defined namespace. It will contextualize every underlying function calls.
  nameSpace.run(() => {
    const adminDbConnection = getAdminConnection()
    logger.info('setAdminDb adminDbConnection', adminDbConnection.name)
    nameSpace.set('connection', adminDbConnection)
    next()
  })
}

export { resolveTenant, setAdminDb }
