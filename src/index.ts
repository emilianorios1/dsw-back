import express, { NextFunction } from 'express'
import cors from 'cors'
import brands from './routes/brands'
import boatModels from './routes/boatModels'
import boatPublications from './routes/boatPublications'
import carModels from './routes/carModels'
import carPublications from './routes/carPublications'
import planeModels from './routes/planeModels'
import planePublications from './routes/planePublications'
import { auth, claimIncludes } from 'express-oauth2-jwt-bearer'

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/brands', brands);
app.use('/api/boatModels', boatModels);
app.use('/api/boatPublications', boatPublications);
app.use('/api/carModels', carModels);
app.use('/api/carPublications', carPublications)
app.use('/api/planeModels', planeModels)
app.use('/api/planePublications', planePublications)


app.listen(5000)
console.log('Server on port ', 5000)

 