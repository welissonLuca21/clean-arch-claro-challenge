import { VerifyUserAccount } from '@/domain/services/verify-user-account'
import { UserRepository } from '@/infra/db/repositories'
import { EmailTokenRepository } from '@/infra/db/repositories/email-token-repository'
import { addDays } from 'date-fns'

describe('VerifyAccount test case', () => {
  const makeSut = () => {
    const mockedUserRepository = {
      setVerifiedUser: jest.fn(() => ({
        isVerified: true
      }))
    } as unknown as jest.Mocked<UserRepository>

    const mockedEmailTokenRepository = {
      findByToken: jest.fn(),
      deleteToken: jest.fn()
    } as unknown as jest.Mocked<EmailTokenRepository>

    const sut = new VerifyUserAccount(
      mockedUserRepository,
      mockedEmailTokenRepository
    )

    return {
      sut,
      mockedUserRepository,
      mockedEmailTokenRepository
    }
  }

  it('should throw InvalidEmailToken if token is not found', async () => {
    const { sut, mockedEmailTokenRepository } = makeSut()
    mockedEmailTokenRepository.findByToken.mockResolvedValueOnce(undefined)
    const promise = sut.execute('any_token')
    await expect(promise).rejects.toThrow('This token was expired or invalid')
  })

  it('Should return true if user is verified', async () => {
    const { sut, mockedEmailTokenRepository } = makeSut()
    mockedEmailTokenRepository.findByToken.mockResolvedValueOnce({
      expiresAt: addDays(new Date(), 30)
    } as any)
    mockedEmailTokenRepository.deleteToken.mockResolvedValueOnce(undefined)

    const result = await sut.execute('any_token')
    expect(result).toBe(true)
  })
})
