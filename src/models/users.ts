import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    matric: {
        type: String,
        required: true
    },
    level: {
        type : String,
        enum: ['100', '200', '300', '400', '500'],
        required:[true, 'Academic Level is required'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
    email: {
        type: String,
        required: true
    },
    isMatricApproved: {
        type: Boolean,
        default: false
    },
    authentication: {
        password: { type: String, required: true, select: true },
        sessionToken: { type: String, select: true}
    }
})

export const UserModel = mongoose.model('User', UserSchema) 

export const getUsers = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({email})
export const getUserByMatric = (matric: string) => UserModel.findOne({matric})
export const getUserById = (id: string) => UserModel.findById({_id: id})
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({'authentication.sessionToken': sessionToken})
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject())
export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values)
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({_id: id})