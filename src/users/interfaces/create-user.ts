import { AuthProvider } from '@prisma/client';

export class CreateUser {
  fullName: string;
  email: string;
  hash?: string;
  picture?: string;
  provider?: AuthProvider;
}
