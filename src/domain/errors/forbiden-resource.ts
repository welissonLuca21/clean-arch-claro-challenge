export class ForbiddenResourceError extends Error {
  status: number

  constructor() {
    super('Forbiden Resource')
    this.name = 'FORBIDEN_RESOURCE'
    this.status = 403
  }
}
