import { GraphQLError } from 'graphql'

export class InvalidAttribute extends GraphQLError {
  status: number

  constructor(attribute: string, description?: string) {
    let message = `Invalid attribute: ${attribute}`
    if (description) {
      message = message.concat(` - ${description}`)
    }

    super(message, {
      extensions: {
        code: 'INVALID_ATTRIBUTE'
      }
    })
    this.status = 400
  }
}
