import { GraphQLError } from 'graphql'

export class InvalidEmailToken extends GraphQLError {
  status: number

  constructor() {
    super('This token was expired or invalid', {
      extensions: {
        code: 'INVALID_EMAIL_TOKEN'
      }
    })

    this.status = 400
  }
}
