import {Router} from 'express';
import {PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/publications', async (req,res) => {
  const publications = await prisma.publication.findMany()
  res.send(publications)
})

router.post('/publications', async (req, res) => {
  try {
    const publication = await prisma.publication.create({
      data: req.body
    });
    res.send(publication);
  } catch (error) {
    // Handle the error here, for example, you can send an error response to the client.
    res.status(500).send({ error: 'An error occurred while creating the publication.' });
  }
});

export default router;