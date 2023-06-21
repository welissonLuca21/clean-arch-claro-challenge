import jwt from 'jsonwebtoken'
import { Service } from 'typedi'

@Service()
export class JwtProvider {
  encryptToken = (plaintext: string, secret: string): string => {
    return jwt.sign({ id: plaintext }, secret)
  }

  decryptToken = (ciphertext: string, secret: string): jwt.JwtPayload => {
    return jwt.verify(ciphertext, secret) as any
  }
}
