import express from "express";
import bcrypt from "bcryptjs";
import { getUserByEmail, createUser, UserModel } from "../models/users";
import jwt from "jsonwebtoken";
const JWT_SECRET="NIMELSSA_QUIZ_2024"
// export const register = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//    try {
//       const { firstname, lastname, email, matric, password } = req.body
//       if(!firstname || !lastname || !email || !matric || !password){
//         res.status(400).json({errorMessage: 'Incomplete request data'})
//       }

//       const existingUser = await getUserByEmail(email)
//       if(existingUser){
//         return res.status(400).json({errorMessage: 'User already exist'})
//       }

//       const salt = random()

//       const userPayload = {
//         firstname, lastname, email, matric, authentication: {
//             salt, password: authentication(salt, password)
//           }
//       }
//       const newUser = await createUser(userPayload)

//      return res.status(200).json({successMessage: 'User was successfully created', user: newUser})
//    } catch (error) {
//     console.log(error, 'error here')
//      res.status(500).json({errorMessage: 'Something went wrong'})
//    }
// }

export const register = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { firstname, lastname, email, matric, password, level, role } = req.body;
    if (!firstname || !lastname || !email || !matric || !password || !level || !role) {
      res.status(400).json({ errorMessage: "Incomplete request data" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ errorMessage: "User already exist" });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const userPayload = {
      firstname,
      lastname,
      level,
      role,
      email,
      matric,
      authentication: {
        salt,
        password: hashedPassword,
      },
    };
    const newUser = await createUser(userPayload);

    return res
      .status(200)
      .json({ successMessage: "User was successfully created", user: newUser });
  } catch (error) {
    console.log(error, "error here");
    res.status(500).json({ errorMessage: "Something went wrong" });
  }
};

// export const login = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//   try {
//      const { matric, password } = req.body
//      if(!matric || !password){
//        res.status(400).json({errorMessage: 'Incomplete request data'})
//      }

//      const user = await getUserByMatric(matric).select('+authentication.salt +authentication.password')
//      if(!user){
//       res.status(400).json({errorMessage: 'User does not exist'})
//       return
//      }

//      const expectedHash = authentication(user.authentication.salt, password)

//      if(user.authentication.password !== expectedHash){
//       res.status(404).json({errorMessage: 'Invalid credentials'})
//       return
//      }

//      const salt = random()
//      user.authentication.sessionToken = authentication(salt, user._id.toString())
//      await user.save()
//      res.cookie('QUIZ-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' })
//      return res.status(200).json(user)
//   } catch (error) {
//     res.status(500).json({errorMessage: 'Something went wrong'})
//   }
// }

export const login = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { matric, password } = req.body;
    if (!matric || !password) {
      res.status(400).json({ errorMessage: "Incomplete request data" });
    }
    const user = await UserModel.findOne({ matric }).populate('authentication');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(!user.isMatricApproved){
      return res.status(404).json({ message: "Matric Number not approved. Contact Academic team to get your matric approved." });
    }
    const { authentication } = user
    const passwordMatch = await bcrypt.compare(
      password,
      authentication?.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const maxAge = 3 * 24 * 60 * 60;
    const payload = {
      id: user._id,
      role: user.role,
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: maxAge,
    });
    user.authentication.sessionToken = accessToken
    await user.save();
    res.cookie("QUIZ_AUTH_TOKEN", accessToken, {
      path: "/",
      maxAge: maxAge * 1000,
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json({ user, token: accessToken });
  } catch (error) {
    res.status(500).json({ errorMessage: "Something went wrong" });
  }
};
