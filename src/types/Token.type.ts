import { Document } from 'mongoose'

type BearerToken = string
type Issuer = string

interface Token {
  token: BearerToken
  user: string
  expirationDate: Date
}

interface TokenResponse {
  user: any
  token: BearerToken
  expirationDate: Date
}

type TokenDocument = Token & Document

interface Payload {
  sub: string
  iat: number
  exp: number
  issuer: Issuer
}

export { Token, TokenDocument, TokenResponse, Payload, BearerToken }
