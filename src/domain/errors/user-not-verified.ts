export class UserNotVerifiedError extends Error {
  status: number

  constructor() {
    super('User not verified')
    this.name = 'UserNotVerifiedError'
    this.status = 403
  }
}
