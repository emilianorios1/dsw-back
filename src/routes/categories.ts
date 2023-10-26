import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
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
    // Validate and sanitize the request data
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if the category with the same name already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: name },
    });

    if (existingCategory) {
      return res.status(409).json({ error: 'Category with the same name already exists' });
    }
    
    // Create the category
    const category = await prisma.category.create({
      data: {
        name: name,
        // Other fields if necessary
      }
    });

    // Return the created category
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/categories/:id', async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const updatedCategoryData = req.body;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if the updated name already exists in another category
    if (updatedCategoryData.name) {
      const categoryWithSameName = await prisma.category.findFirst({
        where: {
          NOT: { id: categoryId },
          name: updatedCategoryData.name,
        },
      });

      if (categoryWithSameName) {
        return res.status(409).json({ error: 'Category with the same name already exists' });
      }
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: updatedCategoryData,
    });

    res.json(category); // Return the updated category
  } catch (error) {
    console.error('Error updating category:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
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

    await prisma.publication.deleteMany({
      where: {
        categoryId: categoryId
      }
    })

    // If the category exists, delete it
    await prisma.category.delete({
      where: { id: categoryId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router;