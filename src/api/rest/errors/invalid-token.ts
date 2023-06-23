export class InvalidToken extends Error {
  status: number

  constructor() {
    super('Invalid expired')
    this.name = 'INVALID TOKEN'
    this.status = 400
  }
}
