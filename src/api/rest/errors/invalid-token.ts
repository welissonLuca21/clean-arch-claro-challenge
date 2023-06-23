export class InvalidToken extends Error {
  status: number

  constructor() {
    super('Invalid token')
    this.name = 'INVALID TOKEN'
    this.status = 400
  }
}
