import express from 'express'
import cors from 'cors'
import publicationsRoutes from './routes/publications'
import categoriesRoutes from './routes/categories'
import carsRoutes from './routes/cars'
import brandsRoutes from './routes/brands'
import modelsRoutes from './routes/models'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api', publicationsRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', carsRoutes);
app.use('/api', brandsRoutes);
app.use('/api',modelsRoutes)


app.listen(5000)
console.log('Server on port ', 5000)

