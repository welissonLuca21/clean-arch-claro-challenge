import { User } from '@prisma/client'

export const MockedUser = {
  id: 'id',
  firstName: 'Ruan',
  lastName: 'Silva',
  email: 'example@example.com',
  password: '123456',
  createdAt: new Date(),
  updatedAt: new Date(),
  isVerified: true
} as User
