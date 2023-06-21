import { CreateUser } from '@/domain/services/create-user'
import { STATUS_CODE } from '@/constants/status-codes'
import { Router } from 'express'
import Container from 'typedi'
import { asyncHandler } from '@/api/rest/middlewares/async-handlers'

const createUserService = Container.get(CreateUser)

export class UserRoutes {
  private readonly _router = Router()

  constructor() {
    this._router.post('/', asyncHandler(this.create))
  }

  get router() {
    return this._router
  }

  create = async (req, res) => {
    const result = await createUserService.create(req.body)
    return res.status(STATUS_CODE.CREATED).json(result)
  }
}
