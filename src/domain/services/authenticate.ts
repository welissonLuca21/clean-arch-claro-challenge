import env from '@/config/env'
import { UserRepository } from '@/infra/db/repositories'
import { HashProvider } from '@/infra/providers/hash-provider'
import { JwtProvider } from '@/infra/providers/jwt-provider'
import { Service } from 'typedi'
import { UserNotFoundError } from '../errors/user-not-found'
import { InvalidAttribute } from '../errors/invalid-attribute'
import { UserNotVerifiedError } from '../errors/user-not-verified'

type Params = {
  email: string
  password: string
}

@Service()
export class Authenticate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: HashProvider,
    private readonly jwtProvider: JwtProvider
  ) {}

  async execute(params: Params) {
    const { email, password } = params

    if (!email?.trim()) {
      throw new InvalidAttribute('email', 'Email is required')
    }

    if (!password?.trim()) {
      throw new InvalidAttribute('password', 'Password is required')
    }

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new UserNotFoundError()
    }

    const isValidPassword = await this.hashProvider.compareHash(
      password,
      user.password
    )
    if (!isValidPassword) {
      throw new UserNotFoundError()
    }

    if (!user.isVerified) {
      throw new UserNotVerifiedError()
    }

    const token = this.jwtProvider.encryptToken(user.id, env.JWT_SECRET)
    return {
      userId: user.id,
      accessToken: token
    }
  }
}
