import { GraphQLError } from 'graphql'

export class UserNotFoundError extends GraphQLError {
  status: number

  constructor() {
    super('User not found', {
      extensions: {
        code: 'USER_NOT_FOUND'
      }
    })
    this.status = 404
  }
}
