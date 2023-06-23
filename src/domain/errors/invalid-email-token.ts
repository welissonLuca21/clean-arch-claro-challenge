export class InvalidEmailToken extends Error {
  status: number

  constructor() {
    super('This token was expired or invalid')
    this.name = 'InvalidEmailToken'
    this.status = 400
  }
}
