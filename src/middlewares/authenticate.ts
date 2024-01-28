import express from 'express'
import jsonwebtoken from "jsonwebtoken";
import { UserModel } from "../models/users";

export const requireAuth = (req:express.Request, res:express.Response, next:express.NextFunction) => {
  const token = req.cookies.QUIZ_AUTH_TOKEN;
  if (token) {
    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err: Record<string, any>) => {
      if (err) {
        return res.status(401).json({ errorMessage: "Something went wrong." });
      } else {
        next();
      }
    });
  } else {
    return res.status(401).json({ errorMessage: "Access denied" });
  }
};

export const checkAdminAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req?.headers && req?.headers?.authorization && req?.headers?.authorization.split(' ')[0] === 'Bearer') {
    jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err: Record<string, any>, decodedToken: Record<string, any>) => {
      if (err) {
        return res.status(401).json({ errorMessage: err.message });
      }
      if (decodedToken?.role !== 'admin') {
        return res.status(401).json({ errorMessage: "Access Denied. You need Admin role access." });
      }
      UserModel.findById(decodedToken.id).then((user) => {
        res.locals.user = user;
        next();
      }).catch((err) => {
        return res.status(500).json({ errorMessage: err.message })
      })
    }
    )
  } else {
    return res.status(403).json({ errorMessage: "Access denied." });
  }
};

export const checkUserAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req?.headers && req?.headers?.authorization && req?.headers?.authorization.split(' ')[0] === 'Bearer') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err: Record<string, any>, decodedToken: Record<string, any>) => {
        if (err) {
          return res.status(401).json({ errorMessage: err.message });
        }
        if (decodedToken?.role !== 'user') {
          return res.status(401).json({ errorMessage: "Access Denied. You need User role access." });
        }
        UserModel.findById(decodedToken.id).then((user) => {
          res.locals.user = user;
          next();
        }).catch((err) => {
          return res.status(500).json({ errorMessage: err.message })
        })
      }
      )
    } else {
      return res.status(403).json({ errorMessage: "Access denied." });
    }
  };

  export const checkUserMatricApprovalAccess = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req?.headers && req?.headers?.authorization && req?.headers?.authorization.split(' ')[0] === 'Bearer') {
      jsonwebtoken.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, async (err: Record<string, any>, decodedToken: Record<string, any>) => {
        if (err) {
          return res.status(401).json({ errorMessage: err.message });
        }
        if (decodedToken?.isMatricApproved === false) {
          return res.status(401).json({ errorMessage: "SORRY!!! Please ensure your Matric number is approved." });
        }
        UserModel.findById(decodedToken.id).then((user) => {
          res.locals.user = user;
          next();
        }).catch((err) => {
          return res.status(500).json({ errorMessage: err.message })
        })
      }
      )
    } else {
      return res.status(403).json({ errorMessage: "Access denied." });
    }
  };