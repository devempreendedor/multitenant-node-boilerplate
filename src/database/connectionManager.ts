import { getNamespace } from 'continuation-local-storage'

import { initAdminDbConnection } from './initAdminDbConnection'
import { initTenantDbConnection } from './initTenantDbConnection'

import { companyService } from '../services'
import { config, logger } from '../configs'
import { Company } from '../types'

let connectionMap: any
let adminDbConnection: any

const connectAllDb = async () => {
  let tenants
  const ADMIN_DB_URI = `${config.database.URI}/pkclub_admin`
  adminDbConnection = initAdminDbConnection(ADMIN_DB_URI)
  logger.info('connectAllDb adminDbConnection', adminDbConnection.name)
  try {
    tenants = await companyService.getAllCompanies(adminDbConnection)
    logger.info('connectAllDb tenants', tenants)
  } catch (e) {
    logger.error('connectAllDb error', e)
    return
  }
  connectionMap = tenants
    .map((company: Company) => {
      return {
        [company.slug]: initTenantDbConnection(company.dbURI),
      }
    })
    .reduce((prev: any, next: any) => {
      return Object.assign({}, prev, next)
    }, {})
}

const getConnectionByTenant = (tenantName: string) => {
  logger.info(`Getting connection for ${tenantName}`)
  if (connectionMap) {
    return connectionMap[tenantName]
  }
}

const getAdminConnection = () => {
  if (adminDbConnection) {
    logger.info('Getting adminDbConnection')
    return adminDbConnection
  }
}

const getConnection = () => {
  const nameSpace = getNamespace('unique context')
  const conn = nameSpace.get('connection')

  if (!conn) {
    throw new Error('Connection is not set for any tenant database')
  }

  return conn
}

export {
  connectAllDb,
  getAdminConnection,
  getConnection,
  getConnectionByTenant,
}
