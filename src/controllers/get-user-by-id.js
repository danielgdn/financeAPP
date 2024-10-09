import validator from 'validator'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { badrequest, notFounder, ok, serverError } from './helpers.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badrequest({
                    message: 'The provided id is not Valid',
                })
            }

            const getuserbyidUseCase = new GetUserByIdUseCase()

            const user = await getuserbyidUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return notFounder({
                    message: 'User not found. ',
                })
            }

            return ok(user)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
