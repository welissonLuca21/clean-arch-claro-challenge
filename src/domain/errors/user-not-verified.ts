import { GraphQLError } from 'graphql'

export class UserNotVerifiedError extends GraphQLError {
  status: number

  constructor() {
    super('User not verified', {
      extensions: {
        code: 'USER_NOT_VERIFIED'
      }
    })
    this.status = 403
  }
}
