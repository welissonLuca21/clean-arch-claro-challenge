import { Devices, PrismaClient } from '@prisma/client'
import { Service } from 'typedi'

@Service()
export class DevicesRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async createDevice(params: CreateDeviceParams): Promise<Devices> {
    return this.prisma.devices.create({
      data: params
    })
  }

  async countUserDevices(userId: string): Promise<number> {
    return this.prisma.devices.count({
      where: {
        userId
      }
    })
  }

  async findById(deviceId: string): Promise<Devices> {
    return this.prisma.devices.findUnique({
      where: {
        id: deviceId
      }
    })
  }

  async delete(deviceId: string): Promise<Devices> {
    return this.prisma.devices.delete({
      where: {
        id: deviceId
      }
    })
  }
}

export interface CreateDeviceParams {
  name: string
  deviceModel: string
  userId: string
}
