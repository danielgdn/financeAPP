import 'dotenv/config.js'
import express from 'express'

import { CreateUserController } from './src/controllers/create-user.js'
import { GetUserByIdController } from './src/controllers/get-user-by-id.js'

const app = express()

app.use(express.json())
app.post('/api/users', async (request, response) => {
    const createUserController = new CreateUserController()

    const { statusCode, body } = await createUserController.execute(request)

    response.status(statusCode).json(body)
})
app.get('/api/users/:userId', async (request, response) => {
    const getUserByIdcontroller = new GetUserByIdController()

    const { statusCode, body } = await getUserByIdcontroller.execute(request)

    response.status(statusCode).json(body)
})

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
