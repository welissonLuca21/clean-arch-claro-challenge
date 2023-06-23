import { NextFunction, Request, RequestHandler, Response } from 'express'
import { verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

import ENV from '@/config/env'
import { InvalidToken, TokenHasExpired } from '@/api/rest/errors'

interface DecodedToken {
  id: string
}

export const authorizeMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new InvalidToken()
  }

  const token = authorizationHeader.split(' ')[1]

  try {
    const decoded = verify(token, ENV.JWT_SECRET) as DecodedToken
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new TokenHasExpired()
    } else if (error instanceof JsonWebTokenError) {
      throw new InvalidToken()
    } else {
      throw new Error('Error while verifying token')
    }
  }
}
