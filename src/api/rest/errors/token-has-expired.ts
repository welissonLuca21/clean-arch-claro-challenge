export class TokenHasExpired extends Error {
  status: number

  constructor() {
    super('Token has expired')
    this.name = 'TOKEN_HAS_EXPIRED'
    this.status = 401
  }
}
