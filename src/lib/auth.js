import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
const secret=process.env.JWT_SECRET;
if(!secret&&process.env.NODE_ENV==='production') throw new Error('JWT_SECRET is required in production');
export const hashPassword=(value)=>bcrypt.hash(value,12);
export const comparePassword=(value,hash)=>bcrypt.compare(value,hash);
export const issueToken=(payload)=>jwt.sign(payload,secret||'development-only-secret',{expiresIn:'7d'});
export const verifyToken=(token)=>{try{return jwt.verify(token,secret||'development-only-secret')}catch{return null}};
export async function getAuthUserFromRequest(){const token=(await cookies()).get('auth_token')?.value;return token?verifyToken(token):null;}
export const authorizeRole=(user,roles)=>Boolean(user&&roles.includes(user.role));
export const sanitizeUser=(user)=>{if(!user)return null;const {password_hash,...safe}=user;return safe;};
