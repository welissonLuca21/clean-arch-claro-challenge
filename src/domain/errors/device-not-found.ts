export class DeviceNotFoundError extends Error {
  status: number

  constructor() {
    super('Device not found')
    this.name = 'DEVICE_NOT_FOUND'
    this.status = 404
  }
}
