import {Router} from 'express';
import {PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/categories', async (req,res) => {
  const categories = await prisma.category.findMany()
  res.send(categories)
})

router.get('/categories/:id', async (req,res) => {
  const category = await prisma.category.findUnique({
    where: {id: parseInt(req.params.id)}
  });
  res.send(category)
})

router.post('/categories', async(req, res) =>{
try {
  console.log(req.body)
  const category = await prisma.category.create({
    data: req.body
  })
  res.send(req.body)
} catch (error) {
  
  
  console.log(error);
}
})

export default router;