import { Document } from 'mongoose'

export interface User {
  name: string
  email: string
  password: string
}

export interface UserDocument extends User, Document {
  doesPasswordMatch: (password: string) => Promise<boolean>
}
