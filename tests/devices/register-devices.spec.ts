import {
  DevicesRepository,
  CreateDeviceParams
} from '@/infra/db/repositories/devices-repository'
import { UserRepository } from '@/infra/db/repositories/user-repository'
import { UserNotFoundError, DeviceLimitReaching } from '@/domain/errors'
import { RegisterDevice } from '@/domain/services/register-device'
import { Device } from '@/domain/entities/devices'

const makeSut = () => {
  const mockedDevicesRepository = {
    createDevice: jest.fn(),
    countUserDevices: jest.fn()
  } as any as jest.Mocked<DevicesRepository>

  const mockedUserRepository = {
    findById: jest.fn()
  } as any as jest.Mocked<UserRepository>

  const sut = new RegisterDevice(mockedDevicesRepository, mockedUserRepository)

  return {
    sut,
    mockedDevicesRepository,
    mockedUserRepository
  }
}

describe('RegisterDevice test case', () => {
  it('should throw UserNotFoundError if user is not found', async () => {
    const { sut, mockedUserRepository } = makeSut()
    mockedUserRepository.findById.mockResolvedValueOnce(null)

    await expect(
      sut.execute({ name: 'Device 1', deviceModel: 'Model 1' }, 'user-id')
    ).rejects.toThrow(UserNotFoundError)
  })

  it('should throw DeviceLimitReaching if user has reached the maximum limit of devices', async () => {
    const { sut, mockedDevicesRepository, mockedUserRepository } = makeSut()
    mockedUserRepository.findById.mockResolvedValueOnce({
      id: 'user-id'
    } as any)
    mockedDevicesRepository.countUserDevices.mockResolvedValueOnce(3)

    await expect(
      sut.execute({ name: 'Device 1', deviceModel: 'Model 1' }, 'user-id')
    ).rejects.toThrow(DeviceLimitReaching)
  })

  it('should create a new device if user exists and has not reached the maximum limit', async () => {
    const { sut, mockedDevicesRepository, mockedUserRepository } = makeSut()
    const newDevice: Device = {
      id: 'device-id',
      name: 'Device 1',
      deviceModel: 'Model 1',
      userId: 'user-id'
    } as Device
    mockedUserRepository.findById.mockResolvedValueOnce({
      id: 'user-id'
    } as any)
    mockedDevicesRepository.countUserDevices.mockResolvedValueOnce(2)
    mockedDevicesRepository.createDevice.mockResolvedValueOnce(newDevice)

    const deviceParams: Omit<CreateDeviceParams, 'userId'> = {
      name: 'Device 1',
      deviceModel: 'Model 1'
    }
    const result = await sut.execute(deviceParams, 'user-id')

    expect(result).toEqual(newDevice)
    expect(mockedDevicesRepository.createDevice).toHaveBeenCalledWith({
      ...deviceParams,
      userId: 'user-id'
    })
  })
})
