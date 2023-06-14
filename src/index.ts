import express from 'express'

import publicationsRoutes from './routes/publications'
import categoriesRoutes from './routes/categories'

const app = express()
app.use(express.json())

app.use('/api', publicationsRoutes);
app.use('/api', categoriesRoutes);


app.listen(3000)
console.log('Server on port ', 3000)

