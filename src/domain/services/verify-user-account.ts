import { UserRepository } from '@/infra/db/repositories'
import { EmailTokenRepository } from '@/infra/db/repositories/email-token-repository'
import { Service } from 'typedi'
import { InvalidEmailToken } from '../errors/invalid-email-token'

@Service()
export class VerifyUserAccount {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailTokenRepository: EmailTokenRepository
  ) {}

  async execute(token: string) {
    const sanitizedToken = token?.trim()
    const emailToken = await this.emailTokenRepository.findByToken(
      sanitizedToken
    )

    if (!emailToken) {
      throw new InvalidEmailToken()
    }

    const user = await this.userRepository.setVerifiedUser(emailToken.userId)
    await this.emailTokenRepository.deleteToken(sanitizedToken)
    return user.isVerified
  }
}
