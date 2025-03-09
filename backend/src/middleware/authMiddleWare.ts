import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/AuthenticateRequst';



export const decodedUserRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies?.refreshToken || req.header("refreshToken");

  if (!refreshToken) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;
    
    // Cast req to AuthenticatedRequest
    (req as AuthenticatedRequest).user = { 
      ...decoded, 
      rawToken: refreshToken,
      id: decoded.id // Make sure the decoded token has an id property
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token or Expired" });
    return;
  }
};