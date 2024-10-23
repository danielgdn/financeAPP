import { EmailAlreadyInUseError } from '../erros/users.js'
import { UpdteUserUsecase } from '../use-cases/update-user.js'
import { badrequest, ok, serverError } from './helpers.js'
import validator from 'validator'
export class UpdteUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isIdValid = validator.isUUID(userId)

            if (!isIdValid) {
                return badrequest({
                    message: 'The provided id is not Valid',
                })
            }
            const updateUserParams = httpRequest.body

            const allowFields = ['first_name', 'last_name', 'email', 'password']

            const someFieldsIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowFields.includes(field),
            )

            if (someFieldsIsNotAllowed) {
                return badrequest({
                    message: 'Algum campo fornecido não é permitido',
                })
            }

            if (updateUserParams.password) {
                if (updateUserParams.password.length < 6) {
                    return badrequest({
                        errorMessage: `Senha precisa ter 6 caracteres`,
                    })
                }
            }
            if (updateUserParams.email) {
                const emailIsNotvalid = validator.isEmail(
                    updateUserParams.email,
                )

                if (!emailIsNotvalid) {
                    return badrequest({
                        message: 'Email inválido',
                    })
                }
            }

            const updateUserUseCase = new UpdteUserUsecase()

            const updateUser = await updateUserUseCase.execute(
                userId,
                updateUserParams,
            )

            return ok(updateUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badrequest({ message: error.message })
            }
            console.log(error)
            return serverError()
        }
    }
}
