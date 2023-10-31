import express from 'express'
import cors from 'cors'
import brand from './routes/brands'
import boatModel from './routes/boatModels'
import boatPublications from './routes/boatPublications'
import carModel from './routes/boatModels'
import carPublications from './routes/boatPublications'
import planeModel from './routes/boatModels'
import planePublications from './routes/boatPublications'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api', brand);
app.use('/api', boatModel);
app.use('/api', boatPublications);
app.use('/api', carModel);
app.use('/api', carPublications)
app.use('/api', planeModel)
app.use('/api', planePublications)


app.listen(5000)
console.log('Server on port ', 5000)

