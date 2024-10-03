import { CreateUserUseCase } from '../use-cases/create-user.js'
import validator from 'validator'
import { badrequest, created, serverError } from './helpers.js'
import { postgresHelper } from '../db/postgres/helper.js'

export class CreateUserController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body
            //validar a requisição(campos obrigatórios e tamanho de senha, e validar email)

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badrequest({
                        errorMessage: `Missing param: ${field}`,
                    })
                }
            }

            const emailExist = await postgresHelper.query(
                'SELECT email FROM users WHERE email = $1 LIMIT 1',
                [params.email],
            )

            if (emailExist.length > 0) {
                return badrequest({ errorMessage: 'Email já cadastrado' })
            }

            const emailIsValid = validator.isEmail(params.email)

            if (!emailIsValid) {
                return badrequest({
                    errorMessage: `email is not valid. Please provide a valid one.`,
                })
            }

            if (params.password.length < 6) {
                return badrequest({
                    errorMessage: `Senha precisa ter 6 caracteres`,
                })
            }

            //chamar o use case
            const createUserUseCase = new CreateUserUseCase()

            const createUser = await createUserUseCase.execute(params)
            //retornar a resposta para o usuário (status code)
            return created(createUser)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
