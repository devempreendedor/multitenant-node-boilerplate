import { Schema, model, Model } from 'mongoose'
import { CompanyDocument } from '../types'

type ICompany = Model<CompanyDocument>

const companySchema: Schema<CompanyDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    dbURI: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

export default model<CompanyDocument, ICompany>('Company', companySchema)
