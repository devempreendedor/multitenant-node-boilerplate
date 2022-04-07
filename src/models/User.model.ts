import { Schema, model, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

import { UserDocument } from '../types/User.type'

interface IUser extends Model<UserDocument> {
  doesEmailExist: (email: string) => Promise<boolean>
}

const userSchema: Schema<UserDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

/* eslint-disable-next-line func-names */
userSchema.statics.doesEmailExist = async function (
  email: string
): Promise<boolean> {
  const user = await this.findOne({ email })
  return Boolean(user)
}

/* eslint-disable-next-line func-names */
userSchema.methods.doesPasswordMatch = async function (
  password: string
): Promise<boolean> {
  const user = this

  return bcrypt.compare(password, user.password)
}

/* eslint-disable-next-line func-names */
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

export default model<UserDocument, IUser>('User', userSchema)
