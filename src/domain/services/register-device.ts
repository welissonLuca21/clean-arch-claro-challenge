import { UserRepository } from '@/infra/db/repositories'
import {
  CreateDeviceParams,
  DevicesRepository
} from '@/infra/db/repositories/devices-repository'
import { Service } from 'typedi'
import { Device } from '../entities/devices'
import { UserNotFoundError } from '../errors'
import { DeviceLimitReaching } from '../errors/device-limit-reaching'

@Service()
export class RegisterDevice {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(
    deviceParams: Omit<CreateDeviceParams, 'userId'>,
    userId: string
  ): Promise<Device> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new UserNotFoundError()
    }

    const userDevicesCount = await this.devicesRepository.countUserDevices(
      userId
    )

    const deviceLimit = 3
    if (userDevicesCount >= deviceLimit) {
      throw new DeviceLimitReaching()
    }

    const newDevice = await this.devicesRepository.createDevice({
      ...deviceParams,
      userId
    })

    return newDevice
  }
}
