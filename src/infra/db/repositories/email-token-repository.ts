import { prisma } from '@/config/prisma-client'
import { Service } from 'typedi'

@Service()
export class EmailTokenRepository {
  createToken = async (params: CreateTokenParams) => {
    return await prisma.emailToken.create({
      data: {
        token: params.token,
        userId: params.userId,
        expiresAt: params?.expiresAt,
        type: params.type
      }
    })
  }

  deleteToken = async (token: string) => {
    return await prisma.emailToken.delete({
      where: {
        token
      }
    })
  }

  findByToken = async (token: string) => {
    return await prisma.emailToken.findFirst({
      where: {
        token
      }
    })
  }
}

export enum EmailTokenType {
  ACCOUNT_CONFIRMATION = 'ACCOUNT_CONFIRMATION',
  RESET_PASSWORD = 'PASSWORD_RESET'
}

type CreateTokenParams = {
  token: string
  userId: string
  expiresAt?: Date
  type: EmailTokenType
}
