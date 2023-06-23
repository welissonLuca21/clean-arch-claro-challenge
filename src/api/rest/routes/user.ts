import { CreateUser } from '@/domain/services/create-user'
import { STATUS_CODE } from '@/constants/status-codes'
import { Request, Response, Router } from 'express'
import Container from 'typedi'
import { asyncHandler } from '@/api/rest/middlewares/async-handlers'
import { VerifyUserAccount } from '../../../domain/services/verify-user-account'

const createUserService = Container.get(CreateUser)
const verifyUserAccount = Container.get(VerifyUserAccount)

export class UserRoutes {
  private readonly router = Router()

  constructor() {
    this.router.post('/', asyncHandler(this.create))
    this.router.post('/verify-account', asyncHandler(this.verifyAccount))
  }

  get getRouter() {
    return this.router
  }

  create = async (req: Request, res: Response) => {
    const result = await createUserService.create(req.body)
    return res.status(STATUS_CODE.CREATED).json(result)
  }

  verifyAccount = async (req: Request, res: Response) => {
    const { token } = req.body
    const result = await verifyUserAccount.execute(token)
    return res.status(STATUS_CODE.OK).json(result)
  }
}
