import express from 'express'
import { get, identity, merge } from 'lodash'
import { getUserBySessionToken } from '../models/users'

export const isAuthenticated = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
  try {
    const sessionToken = req.cookies['QUIZ-AUTH']
    if(!sessionToken){
        return res.status(403).json({errorMessage: 'User not found'})
    }

    const existingUser = await getUserBySessionToken(sessionToken)
    if(!existingUser){
        return res.status(403).json({errorMessage: 'User not found'})
    }
    merge(req, {identity: existingUser})
    return next()
  } catch (error) {
    return res.status(404).json({errorMessage: 'Something went wrong'})
  }
}