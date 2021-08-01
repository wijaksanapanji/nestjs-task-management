import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

enum PostgreErrors {
    DUPLICATE = '23505',
}

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    async createUser(authCredetentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredetentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({ username, password: hashedPassword });

        try {
            await this.save(user);
        } catch (error) {
            if (error.code === PostgreErrors.DUPLICATE) {
                throw new ConflictException('Username already exists');
            }

            throw new InternalServerErrorException(
                'Please check your login credentials',
            );
        }
    }
}
