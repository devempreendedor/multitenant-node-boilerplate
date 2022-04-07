import express, { Router } from 'express'
import { companyController } from '../../controller'
import { setAdminDb } from '../../middlewares/connectionResolver'

const router: Router = express.Router()

router.use(setAdminDb)

router.post('/', companyController.createClub)

export { router as companyRoutes }
