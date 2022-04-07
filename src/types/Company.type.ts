import { Document } from 'mongoose'

export interface Company {
  name: string
  slug: string
  dbURI: string
}

export interface CompanyDocument extends Document, Company {}
