import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import createHttpError, { HttpError } from 'http-errors'
import cors from 'cors'
import { config, strategy } from './configs'
import { connectAllDb } from './database/connectionManager'
import { router as routes } from './routes/v1'
import { errorHandler, successHandler } from './configs/morgan'
import passport from 'passport'

const app = express()

app.use(successHandler)
app.use(errorHandler)

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

passport.use('jwt', strategy)

connectAllDb()

app.use('/api/v1', routes)

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404))
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const { status = 500, message, stack } = err

  res.locals.errorMessage = message

  const response: { status: number; message: string; stack?: string } = {
    status,
    message,
  }

  if (config.environment === 'development') {
    response.stack = stack
  }

  res.status(status).json(response)
})

export { app }
