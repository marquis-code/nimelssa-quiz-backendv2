import { Document } from 'mongoose'
export interface IUser extends Document {
    firstname: string,
    lastname: string,
    matric: string,
    level: string,
    role?: string,
    email: string,
    isMatricApproved: boolean,
    authentication: {
        password: string,
        sessionToken: string
    }
}