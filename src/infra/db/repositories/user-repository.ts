import { prisma } from '@/config/prisma-client'
import { Service } from 'typedi'

@Service()
export class UserRepository {
  create = (params: UserRepository.CreateParams) => {
    return prisma.user.create({
      data: {
        ...params
      }
    })
  }

  findByEmail = (email: string) => {
    return prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    })
  }

  setVerifiedUser = (userId: string) => {
    return prisma.user.update({
      where: {
        id: userId
      },
      data: {
        isVerified: true
      }
    })
  }

  findById = (userId: string) => {
    return prisma.user.findUnique({
      where: {
        id: userId
      }
    })
  }
}

export namespace UserRepository {
  export type CreateParams = {
    firstName: string
    lastName: string
    email: string
    password: string
  }
}
