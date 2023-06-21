import { UserRepository } from '@/infra/db/repositories'
import { EmailTokenRepository } from '@/infra/db/repositories/email-token-repository'
import { Service } from 'typedi'
import { InvalidEmailToken } from '../errors/invalid-email-token'

@Service()
export class VerifyUserAccount {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _emailTokenRepository: EmailTokenRepository
  ) {}

  async execute(token: string) {
    const sanitizedToken = token?.trim()
    const emailToken = await this._emailTokenRepository.findByToken(
      sanitizedToken
    )

    if (!emailToken) {
      throw new InvalidEmailToken()
    }

    const user = await this._userRepository.setVerifiedUser(emailToken.userId)
    await this._emailTokenRepository.deleteToken(sanitizedToken)
    return user.isVerified
  }
}
