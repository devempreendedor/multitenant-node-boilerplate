import mongoose from 'mongoose'
import { logger } from '../configs'
mongoose.Promise = global.Promise

const clientOption = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  poolSize: 5,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}

mongoose.connection.on('connected', () => {
  logger.info('Mongoose default connection open')
})

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  logger.error('Mongoose default connection error: ' + err)
})

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  logger.info('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    logger.info(
      'Mongoose default connection disconnected through app termination'
    )
    process.exit(0)
  })
})

const initTenantDbConnection = (DB_URL: string) => {
  try {
    const db = mongoose.createConnection(DB_URL, clientOption)

    db.on(
      'error',
      console.error.bind(
        console,
        'initTenantDbConnection MongoDB Connection Error>> : '
      )
    )
    db.once('open', () => {
      logger.info('initTenantDbConnection client MongoDB Connection ok!')
    })

    // require all schemas !?
    require('../models/User.model')
    return db
  } catch (error) {
    logger.error('initTenantDbConnection error', error)
  }
}

export { initTenantDbConnection }
