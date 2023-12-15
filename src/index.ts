import express from 'express'
import cors from 'cors'
import brands from './routes/brands'
import boatModels from './routes/boatModels'
import boatPublications from './routes/boatPublications'
import carModels from './routes/carModels'
import carPublications from './routes/carPublications'
import planeModels from './routes/planeModels'
import planePublications from './routes/planePublications'
import { checkJwt } from './middleware/middleware';


const app = express()
app.use(express.json())
app.use(cors())

app.use('/api', brands);
app.use('/api', boatModels);
app.use('/api', boatPublications);
app.use('/api', carModels);
app.use('/api', carPublications)
app.use('/api', planeModels)
app.use('/api', planePublications)


app.listen(5000)
console.log('Server on port ', 5000)

