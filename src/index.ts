import express from 'express'
import publicationsRoutes from './routes/publications'
import categoriesRoutes from './routes/categories'
import { env } from 'process'

const app = express()
app.use(express.json())

app.use('/api', publicationsRoutes);
app.use('/api', categoriesRoutes);


app.listen(env.PORT)
console.log('Server on port ', env.PORT)

