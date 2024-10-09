import { EmailAlreadyInUseError } from '../erros/users.js'
import { CreateUserUseCase } from '../use-cases/create-user.js'
import { badrequest, created, serverError } from './helpers.js'

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
            if (error instanceof EmailAlreadyInUseError) {
                return badrequest({ message: error.message })
            }
            console.log(error)
            return serverError()
        }
    }
}
