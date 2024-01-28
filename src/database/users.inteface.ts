import { Document } from 'mongoose'

export interface UserInterface extends Document {
 firstName: string,
 lastName: string,
 matric: string,
role: string,
 level: string,
 isMatricApproved: boolean,
 authentication: {
    password: string,
    sessionToken: string
 }
}