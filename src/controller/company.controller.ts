import { companyService } from '../services'
import { logger } from '../configs'
import { getConnection } from '../database/connectionManager'
import { Request, Response } from 'express'

async function createClub(req: Request, res: Response) {
  const dbConnection: any = getConnection()
  logger.info('create dbConnection', dbConnection.name)
  const data = await companyService.createCompany(dbConnection, req.body)
  return res.status(201).send(data)
}

export { createClub }
