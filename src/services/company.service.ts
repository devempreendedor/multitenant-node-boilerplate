import slugify from 'slugify'
import { config } from '../configs'

async function getAllCompanies(adminDbConnection: any) {
  const Company = await adminDbConnection.model('Company')
  return await Company.find({})
}

async function createCompany(adminDbConnection: any, body: any) {
  const Company = await adminDbConnection.model('Company')

  const { name } = body

  let slug = slugify(name, {
    lower: true,
  })

  const existCompany = await Company.findOne({
    slug,
  })

  if (existCompany) {
    slug = slug + (Math.random() + 1).toString(36).substring(5)
  }

  return await new Company({
    name,
    slug,
    dbURI: `${config.database.URI}/mt_${slug}`,
  }).save()
}

export { createCompany, getAllCompanies }
