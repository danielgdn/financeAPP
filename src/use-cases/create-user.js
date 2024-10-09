import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailAlreadyInUseError } from '../erros/users.js'

export class CreateUserUseCase {
    async execute(createUserParams) {
        //gerar id com o uuid
        const userId = uuidv4()

        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()

        const userAlredExists = await postgresGetUserByEmailRepository.execute(
            createUserParams.email,
        )

        if (userAlredExists) {
            throw new EmailAlreadyInUseError()
        }

        //criptografar senha bcrypt
        const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

        const user = {
            id: userId,
            password: hashedPassword,
            first_name: createUserParams.first_name,
            last_name: createUserParams.last_name,
            email: createUserParams.email,
        }

        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createUser = await postgresCreateUserRepository.execute(user)
        return createUser
    }
}
