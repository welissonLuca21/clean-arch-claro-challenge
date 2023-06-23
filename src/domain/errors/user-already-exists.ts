export class UserAlreadyExists extends Error {
  status: number

  constructor() {
    super('User already exists')
    this.name = 'UserAlreadyExists'
    this.status = 400
  }
}
