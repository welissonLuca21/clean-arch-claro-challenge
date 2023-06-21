import { GraphQLError } from 'graphql'

export class UserAlreadyExists extends GraphQLError {
  status: number

  constructor() {
    super('User already exists', {
      extensions: {
        code: 'USER_ALREADY_EXISTS'
      }
    })
    this.status = 400
  }
}
