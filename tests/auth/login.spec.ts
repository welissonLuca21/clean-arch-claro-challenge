import { Authenticate } from '@/domain/services/authenticate'
import { UserRepository } from '@/infra/db/repositories'
import { HashProvider } from '@/infra/providers/hash-provider'
import { JwtProvider } from '@/infra/providers/jwt-provider'
import { UserNotFoundError } from '@/domain/errors/user-not-found'
import { InvalidAttribute } from '@/domain/errors/invalid-attribute'
import { MockedUser } from '@/tests/mocks/user-repository'
import { UserNotVerifiedError } from '@/domain/errors/user-not-verified'

const makeSut = () => {
  const mockedUserRepository = {
    findByEmail: jest.fn()
  } as any as jest.Mocked<UserRepository>

  const mockedHashProvider = {
    compareHash: jest.fn()
  } as any as jest.Mocked<HashProvider>

  const mockedJwtProvider = {
    encryptToken: jest.fn()
  } as any as jest.Mocked<JwtProvider>

  const sut = new Authenticate(
    mockedUserRepository,
    mockedHashProvider,
    mockedJwtProvider
  )

  return { sut, mockedUserRepository, mockedHashProvider, mockedJwtProvider }
}

describe('Authenticate', () => {
  it('should throw InvalidAttribute if email is not provided', async () => {
    const { sut } = makeSut()
    const promise = sut.execute({ email: '', password: 'any_password' })
    await expect(promise).rejects.toThrow(
      new InvalidAttribute('email', 'Email is required')
    )
  })

  it('should throw InvalidAttribute if password is not provided', async () => {
    const { sut } = makeSut()
    const promise = sut.execute({ email: 'any_email', password: '' })
    await expect(promise).rejects.toThrow(
      new InvalidAttribute('password', 'Password is required')
    )
  })

  it('should throw UserNotFoundError if user is not found', async () => {
    const { sut, mockedUserRepository } = makeSut()
    mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined)
    const promise = sut.execute({
      email: 'any_email',
      password: 'any_password'
    })
    await expect(promise).rejects.toThrow(new UserNotFoundError())
  })

  it('should throw UserNotFoundError if password is invalid', async () => {
    const { sut, mockedUserRepository, mockedHashProvider } = makeSut()
    mockedUserRepository.findByEmail.mockResolvedValueOnce(MockedUser)
    mockedHashProvider.compareHash.mockResolvedValueOnce(false)
    const promise = sut.execute({
      email: 'any_email',
      password: 'any_password'
    })
    await expect(promise).rejects.toThrow(new UserNotFoundError())
  })

  it('should throw UserNotVerifiedError if user is not verified', async () => {
    const { sut, mockedUserRepository, mockedHashProvider } = makeSut()
    mockedUserRepository.findByEmail.mockResolvedValueOnce({
      ...MockedUser,
      isVerified: false
    })
    mockedHashProvider.compareHash.mockResolvedValueOnce(true)

    const promise = sut.execute({
      email: 'example@example.com',
      password: '123456'
    })
    await expect(promise).rejects.toThrow(new UserNotVerifiedError())
  })

  it('should return a token if user is authenticated', async () => {
    const { sut, mockedUserRepository, mockedHashProvider, mockedJwtProvider } =
      makeSut()
    mockedUserRepository.findByEmail.mockResolvedValueOnce(MockedUser)
    mockedHashProvider.compareHash.mockResolvedValueOnce(true)
    mockedJwtProvider.encryptToken.mockReturnValueOnce('any_token')
    const result = await sut.execute({
      email: 'any_email',
      password: 'any_password'
    })
    expect(result).toBeDefined()
    expect(result.accessToken).toBe('any_token')
    expect(result.userId).toBeDefined()
  })
})
