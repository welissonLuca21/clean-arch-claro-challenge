import bcrypt from 'bcrypt'
import { Service } from 'typedi'

@Service()
export class HashProvider {
  async createHash(plaintext: string): Promise<string> {
    return bcrypt.hash(plaintext, 12)
  }

  async compareHash(plaintext: string, digest: string): Promise<boolean> {
    return bcrypt.compare(plaintext, digest)
  }
}
