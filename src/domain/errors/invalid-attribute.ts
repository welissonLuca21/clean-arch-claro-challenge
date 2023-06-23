export class InvalidAttribute extends Error {
  status: number

  constructor(attribute: string, description?: string) {
    let message = `Invalid attribute: ${attribute}`
    if (description) {
      message = message.concat(` - ${description}`)
    }

    super(message)
    this.name = 'InvalidAttribute'
    this.status = 400
  }
}
