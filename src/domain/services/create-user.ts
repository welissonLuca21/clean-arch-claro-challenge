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
    private readonly _userRepository: UserRepository,
    private readonly _emailTokenRepository: EmailTokenRepository,
    private readonly _hashProvider: HashProvider,
    private readonly _emailProvider: SendgridProvider,
    private readonly _uniqueIdProvider: UniqueIdProvider
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

    const userExists = await this._userRepository.findByEmail(trimmedEmail)
    if (userExists) {
      throw new UserAlreadyExists()
    }

    const hashedPassword = await this._hashProvider.createHash(password)
    const user = await this._userRepository.create({
      firstName: params.firstName,
      lastName: params.lastName,
      email: trimmedEmail,
      password: hashedPassword
    })

    const uniqueId = this._uniqueIdProvider.createUniqueId()
    await this._emailTokenRepository.createToken({
      token: uniqueId,
      userId: user.id,
      type: EmailTokenType.ACCOUNT_CONFIRMATION
    })

    await this._emailProvider.sendAccountConfirmationEmail({
      to: user.email,
      token: uniqueId
    })
    return user
  }
}
