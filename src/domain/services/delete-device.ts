import { UserRepository } from '@/infra/db/repositories'
import { DevicesRepository } from '@/infra/db/repositories/devices-repository'
import { Service } from 'typedi'
import {
  DeviceNotFoundError,
  ForbiddenResourceError,
  UserNotFoundError
} from '@/domain/errors'

@Service()
export class DeleteDevice {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(deviceId: string, userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const device = await this.devicesRepository.findById(deviceId)

    if (!device) {
      throw new DeviceNotFoundError()
    }

    const userHasPermissionToDeleteDevice = user.id === device.userId

    if (!userHasPermissionToDeleteDevice) {
      throw new ForbiddenResourceError()
    }

    await this.devicesRepository.delete(deviceId)
  }
}
