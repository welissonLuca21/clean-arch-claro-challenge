/* eslint-disable @typescript-eslint/no-unused-vars */
import { STATUS_CODE } from '@/constants/status-codes'
import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`error: ${err.stack}`)

  const status = err.status
  const message = err.message || 'Something went wrong!'

  if (err.type === 'entity.parse.failed') {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .json({ message: 'Invalid JSON!', code: STATUS_CODE.BAD_REQUEST })
  }

  if (!status) {
    return res
      .status(STATUS_CODE.SERVER_ERROR)
      .json({ message: 'Something went wrong!' })
  }

  res.status(status).json({ message, code: status })
}
