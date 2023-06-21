import { UserRepository } from '@/infra/db/repositories'
import { HashProvider } from '@/infra/providers/hash-provider'
import { InvalidAttribute, UserAlreadyExists } from '@/domain/errors'
import { CreateUser } from '@/domain/services/create-user'
import {
  EmailTokenRepository,
  EmailTokenType
} from '@/infra/db/repositories/email-token-repository'
import { SendgridProvider } from '@/infra/mailing/sendgrid'
import { UniqueIdProvider } from '@/infra/providers/unique-id-provider'

const makeSut = () => {
  const mockedUserRepository = {
    create: jest.fn(),
    findByEmail: jest.fn()
  } as any as jest.Mocked<UserRepository>

  const mockedEmailTokenRepository = {
    createToken: jest.fn()
  } as any as jest.Mocked<EmailTokenRepository>

  const mockedHashProvider = {
    createHash: jest.fn()
  } as any as jest.Mocked<HashProvider>

  const mockedEmailProvider = {
    sendAccountConfirmationEmail: jest.fn()
  } as any as jest.Mocked<SendgridProvider>

  const mockedUniqueIdProvider = {
    createUniqueId: jest.fn()
  } as any as jest.Mocked<UniqueIdProvider>

  const sut = new CreateUser(
    mockedUserRepository,
    mockedEmailTokenRepository,
    mockedHashProvider,
    mockedEmailProvider,
    mockedUniqueIdProvider
  )

  return {
    sut,
    mockedUserRepository,
    mockedEmailTokenRepository,
    mockedHashProvider,
    mockedEmailProvider,
    mockedUniqueIdProvider
  }
}

const defaultProps = {
  id: 'any_id',
  firstName: 'John',
  lastName: 'Doe',
  password: 'password',
  email: 'my.email@isValid.com'
}

describe('create user test case', () => {
  it('should throw InvalidAttribute if email is not provided', async () => {
    const { sut } = makeSut()

    const toThrow = () =>
      sut.create({
        ...defaultProps,
        email: ''
      })

    await expect(toThrow).rejects.toThrow(InvalidAttribute)
  })

  it('should throw InvalidAttribute if password is not provided', async () => {
    const { sut } = makeSut()

    const toThrow = () =>
      sut.create({
        ...defaultProps,
        password: ''
      })

    await expect(toThrow).rejects.toThrow(InvalidAttribute)
  })

  it('should throw UserAlreadyExists if user already exists with given email', async () => {
    const { sut, mockedUserRepository } = makeSut()
    mockedUserRepository.findByEmail.mockResolvedValueOnce(defaultProps as any)

    const toThrow = () =>
      sut.create({
        ...defaultProps
      })

    await expect(toThrow).rejects.toThrow(UserAlreadyExists)
  })

  it('should create a new user if email and password are provided and user does not exist with given email', async () => {
    const {
      sut,
      mockedUserRepository,
      mockedEmailTokenRepository,
      mockedHashProvider,
      mockedEmailProvider,
      mockedUniqueIdProvider
    } = makeSut()

    const token = 'token'

    mockedUserRepository.findByEmail.mockResolvedValueOnce(undefined)
    mockedUserRepository.create.mockResolvedValueOnce(defaultProps as any)
    mockedHashProvider.createHash.mockResolvedValueOnce('password')
    mockedUniqueIdProvider.createUniqueId.mockReturnValueOnce(token)
    mockedEmailTokenRepository.createToken.mockResolvedValueOnce(undefined)
    mockedEmailProvider.sendAccountConfirmationEmail.mockResolvedValueOnce(
      undefined
    )

    const result = await sut.create({
      ...defaultProps
    })

    const createProps = {
      email: 'my.email@isValid.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password'
    }

    expect(result).toEqual(defaultProps)
    expect(mockedUserRepository.create).toHaveBeenCalledWith(createProps)
    expect(mockedUniqueIdProvider.createUniqueId).toHaveBeenCalled()
    expect(mockedEmailTokenRepository.createToken).toHaveBeenCalledWith({
      userId: defaultProps.id,
      token,
      type: EmailTokenType.ACCOUNT_CONFIRMATION
    })
    expect(
      mockedEmailProvider.sendAccountConfirmationEmail
    ).toHaveBeenCalledWith({
      to: defaultProps.email,
      token
    })
  })

  it('Should throw InvalidAttribute if email is invalid', async () => {
    const { sut } = makeSut()

    const toThrow = () =>
      sut.create({
        ...defaultProps,
        email: 'invalid_email'
      })

    await expect(toThrow).rejects.toThrow(InvalidAttribute)
  })
})
