import express from 'express';

import { getUsers, UserModel } from '../models/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({errorMessage: 'Something went wrong'})
    }
}
export const approveMatric = async (req: express.Request, res: express.Response) => {
      const _id = req.params.id
  try {
    const user = await UserModel.findOne({_id});
    if (!user) {
     return res.status(400).json({ errorMessage: 'User does not exist' });
    }
    user.isMatricApproved = true;
    await user.save()
    res.status(200).json({successMessage : 'User Matric had been approved successfully'});
  } catch (error) {
    res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
  }
}

export const disapproveMatric = async (req: express.Request, res: express.Response) => {
    const _id = req.params.id
try {
  const user = await UserModel.findOne({_id});
  if (!user) {
   return res.status(400).json({ errorMessage: 'User does not exist' });
  }
  user.isMatricApproved = false;
  await user.save()
  res.status(200).json({successMessage : 'User Matric had been disapproved successfully'});
} catch (error) {
  res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
}
}