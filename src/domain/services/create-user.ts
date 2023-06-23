import { UserRepository } from '@/infra/db/repositories'
import { HashProvider } from '@/infra/providers/hash-provider'
import { Service } from 'typedi'
import { InvalidAttribute, UserAlreadyExists } from '@/domain/errors'
import { isValidEmail } from '@/utils/email-validator'
import { SendgridProvider } from '@/infra/mailing/sendgrid'
import { UniqueIdProvider } from '@/infra/providers/unique-id-provider'
import {
  EmailTokenRepository,
  EmailTokenType
} from '@/infra/db/repositories/email-token-repository'

type Params = {
  firstName: string
  lastName: string
  email: string
  password: string
}

@Service()
export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailTokenRepository: EmailTokenRepository,
    private readonly hashProvider: HashProvider,
    private readonly emailProvider: SendgridProvider,
    private readonly uniqueIdProvider: UniqueIdProvider
  ) {}

  async create(params: Params) {
    const { email, password } = params
    const trimmedEmail = email?.trim()

    if (!trimmedEmail) {
      throw new InvalidAttribute('email', 'Email is required')
    }

    if (!password) {
      throw new InvalidAttribute('password', 'Password is required')
    }

    const validEmail = isValidEmail(trimmedEmail)
    if (!validEmail) {
      throw new InvalidAttribute('email', 'Email is invalid')
    }

    const userExists = await this.userRepository.findByEmail(trimmedEmail)
    if (userExists) {
      throw new UserAlreadyExists()
    }

    const hashedPassword = await this.hashProvider.createHash(password)
    const user = await this.userRepository.create({
      firstName: params.firstName,
      lastName: params.lastName,
      email: trimmedEmail,
      password: hashedPassword
    })

    const uniqueId = this.uniqueIdProvider.createUniqueId()
    await this.emailTokenRepository.createToken({
      token: uniqueId,
      userId: user.id,
      type: EmailTokenType.ACCOUNT_CONFIRMATION
    })

    /* await this.emailProvider.sendAccountConfirmationEmail({
      to: user.email,
      token: uniqueId
    }) */
    return user
  }
}
