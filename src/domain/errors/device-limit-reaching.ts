export class DeviceLimitReaching extends Error {
  status: number

  constructor() {
    super(
      'The user has already reached the maximum limit of registered devices'
    )
    this.name = 'DeviceLimitReaching'
    this.status = 400
  }
}
