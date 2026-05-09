import { z } from 'zod';

export const LoginDto = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const RegisterDto = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').optional(),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof LoginDto>;
export type RegisterInput = z.infer<typeof RegisterDto>;

export interface AuthPayload {
  id: number;
  email: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}