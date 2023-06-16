import {Router} from 'express';
import {PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/publications', async (req,res) => {
  const publications = await prisma.publication.findMany()
  res.send(publications)
})

router.post('/publications', async(req, res) =>{
  const publication = await prisma.user.create({
    data: req.body
  })
  res.send(publication)
})


export default router;