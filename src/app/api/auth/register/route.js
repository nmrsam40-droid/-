import { NextResponse } from 'next/server';
import { createUser,findUserByEmail } from '@/lib/db';
import { hashPassword,sanitizeUser } from '@/lib/auth';
export async function POST(req){const body=await req.json();if(!body.full_name||!body.email||!body.password||body.password.length<8)return NextResponse.json({error:'الاسم والبريد وكلمة مرور من 8 أحرف مطلوبة'},{status:400});if(findUserByEmail(body.email))return NextResponse.json({error:'البريد مستخدم مسبقًا'},{status:409});const user=createUser({full_name:body.full_name,email:body.email,phone:body.phone,password_hash:await hashPassword(body.password),telegram_username:body.telegram_username});return NextResponse.json({success:true,user:sanitizeUser(user)},{status:201});}
