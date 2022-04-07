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
  logger.info('Mongoose default connection error: ' + err)
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

const initAdminDbConnection = (DB_URL: string) => {
  try {
    const db = mongoose.createConnection(DB_URL, clientOption)

    db.on(
      'error',
      console.error.bind(
        console,
        'initAdminDbConnection MongoDB Connection Error>> : '
      )
    )
    db.once('open', () => {
      logger.info('initAdminDbConnection client MongoDB Connection ok!')
    })

    // require all schemas !?
    require('../models/Company.model')
    return db
  } catch (error) {
    logger.error('initAdminDbConnection error', error)
  }
}

export { initAdminDbConnection }
