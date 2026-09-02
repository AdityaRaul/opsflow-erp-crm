import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
export type AuthUser = { id: number; name: string; email: string; role: 'ADMIN'|'SALES'|'WAREHOUSE'|'ACCOUNTS' };
declare global { namespace Express { interface Request { user?: AuthUser } } }
export function authenticate(req: Request, res: Response, next: NextFunction) { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token) return res.status(401).json({ message: 'Authentication required' }); try { req.user = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser; next(); } catch { return res.status(401).json({ message: 'Invalid or expired token' }); } }
export const allow = (...roles: AuthUser['role'][]) => (req: Request, res: Response, next: NextFunction) => !req.user || !roles.includes(req.user.role) ? res.status(403).json({ message: 'You do not have permission for this action' }) : next();
