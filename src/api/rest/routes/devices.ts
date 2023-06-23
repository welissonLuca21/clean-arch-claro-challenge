import { STATUS_CODE } from '@/constants/status-codes'
import { Request, Response, Router } from 'express'
import Container from 'typedi'
import { asyncHandler } from '@/api/rest/middlewares/async-handlers'
import { RegisterDevice } from '@/domain/services/register-device'

const registerDevice = Container.get(RegisterDevice)

export class DevicesRoutes {
  private readonly router = Router()

  constructor() {
    this.router.post('/', asyncHandler(this.create))
  }

  get getRouter() {
    return this.router
  }

  create = async (req: Request, res: Response) => {
    const { id } = req.user
    const result = await registerDevice.execute(req.body, id)
    return res.status(STATUS_CODE.CREATED).json(result)
  }
}
