import 'dotenv/config.js'
import express from 'express'

import { postgresHelper } from './src/db/postgres/helper.js'

const app = express()

app.get('/', async (req, res) => {
    const results = await postgresHelper.query('Select * from users;')

    res.send(JSON.stringify(results))
})

app.listen(8000, () => console.log('Listening on port 3000'))
