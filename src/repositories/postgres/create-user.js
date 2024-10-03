import { postgresHelper } from '../../db/postgres/helper.js'

export class PostgresCreateUserRepository {
    async execute(createUserParams) {
        //criar usuário no postgres

        await postgresHelper.query(
            'INSERT INTO users (id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
            [
                createUserParams.id,
                createUserParams.first_name,
                createUserParams.last_name,
                createUserParams.email,
                createUserParams.password,
            ],
        )

        const createUser = await postgresHelper.query(
            'Select * from users where id = $1',
            [createUserParams.id],
        )

        return createUser[0]
    }
}
