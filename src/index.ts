import express from 'express'
import cors from 'cors'
import publicationsRoutes from './routes/publications'
import categoriesRoutes from './routes/categories'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api', publicationsRoutes);
app.use('/api', categoriesRoutes);


app.listen(process.env.port)
console.log('Server on port ', process.env.port)

