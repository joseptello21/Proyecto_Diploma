import jwt from 'jsonwebtoken';
import { authRepository } from '../repositories/auth.repository';
import { UnauthorizedError, ConflictError } from '../utils/error.handler';
import { LoginInput, RegisterInput, AuthPayload } from '../dtos/auth.dto';

export class AuthService {
  async login(data: LoginInput): Promise<{ token: string; user: AuthPayload }> {
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Usuario no registrado');
    }

    // Comparación directa de contraseña (sin hash)
    if (data.password !== user.contraseña) {
      throw new UnauthorizedError('Contraseña incorrecta');
    }

    const token = this.generateToken({
      id: user.id_usuario,
      email: user.correo,
    });

    // Devolver token y datos de usuario juntos para el frontend.
    return {
      token,
      user: {
        id: user.id_usuario,
        email: user.correo,
      },
    };
  }

  async register(data: RegisterInput): Promise<{ message: string; userId: number }> {
    const existingUser = await authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('Email ya registrado');
    }

    // Guardar contraseña sin hash
    const newUser = await authRepository.create({
      nombre: data.nombre ?? undefined,
      correo: data.email,
      contraseña: data.password,
    });

    return {
      message: 'Usuario registrado exitosamente',
      userId: newUser.id_usuario,
    };
  }

  async validateToken(token: string): Promise<AuthPayload> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as AuthPayload;
      return decoded;
    } catch {
      throw new UnauthorizedError('Token inválido');
    }
  }

  private generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '8h',
    });
  }
}

export const authService = new AuthService();