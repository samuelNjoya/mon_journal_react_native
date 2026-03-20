import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  
  @IsEmail({}, { message: 'adresse email invalide' })
  @IsNotEmpty({ message: 'l\'adresse email est requise' })
  email: string;

  @MinLength(6, { message: 'le mot de passe doit contenir au moins 6 caractères' })
  @IsNotEmpty({ message: 'le mot de passe est requis' })
  password: string;

  @IsOptional()
  role?: string;
}