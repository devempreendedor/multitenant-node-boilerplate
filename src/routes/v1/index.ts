import express, { Router } from 'express'
import { companyRoutes } from './company.route'

const router = express.Router()

interface Route {
  path: string
  routes: Router
}

const routes: Route[] = [
  {
    path: '/companies',
    routes: companyRoutes,
  },
]

routes.forEach((route: Route) => {
  router.use(route.path, route.routes)
})

export { router }
