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

router.post('/categories', async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: req.body
    });
    res.status(201).json(category); // Return the created category
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' }); // Handle other errors
  }
});


router.put('/categories/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const updatedCategoryData = req.body;

  try {
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updatedCategoryData
    });
    if (category) {
      res.json(category); // Return the updated category
    } else {
      res.status(404).json({ error: 'Category not found' }); // Handle category not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' }); // Handle other errors
  }
});

router.delete('/categories/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id);

  try {
    // First, check if the category with the specified ID exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // If the category exists, delete it
    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;