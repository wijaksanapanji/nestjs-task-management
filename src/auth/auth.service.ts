import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async signUp(authCredetentialsDto: AuthCredentialsDto): Promise<void> {
        return this.usersRepository.createUser(authCredetentialsDto);
    }

    async signIn(authCredetentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredetentialsDto;
        const user = await this.usersRepository.findOne({ username });

        if (user && (await bcrypt.compare(password, user.password))) {
            return 'success';
        }

        throw new UnauthorizedException();
    }
}
