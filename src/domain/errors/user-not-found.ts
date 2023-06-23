export class UserNotFoundError extends Error {
  status: number

  constructor() {
    super('User not found')
    this.name = 'UserNotFoundError'
    this.status = 404
  }
}
