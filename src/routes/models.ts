import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/models', async (req,res) => {
  const models = await prisma.model.findMany()
  res.send(models)
})

router.get('/models/:id', async (req,res) => {
  const model = await prisma.model.findUnique({
    where: {id: parseInt(req.params.id)}
  });
  res.send(model)
})

router.post('/models', async (req, res) => {
  try {
    // Validate and sanitize the request data
    const { name, brandId } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Check if the model with the same name already exists
    const existingmodel = await prisma.model.findUnique({
      where: { name: name },
    });

    if (existingmodel) {
      return res.status(409).json({ error: 'model with the same name already exists' });
    }
    
    // Create the model
    const model = await prisma.model.create({
      data: {
        name: name,
        brandId: brandId,
        // Other fields if necessary
      }
    });

    // Return the created model
    res.status(201).json(model);
  } catch (error) {
    console.error('Error creating model:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/models/:id', async (req, res) => {
  const modelId = parseInt(req.params.id);
  const updatedmodelData = req.body;

  try {
    const existingmodel = await prisma.model.findUnique({
      where: { id: modelId },
    });

    if (!existingmodel) {
      return res.status(404).json({ error: 'model not found' });
    }

    // Check if the updated name already exists in another model
    if (updatedmodelData.name) {
      const modelWithSameName = await prisma.model.findFirst({
        where: {
          NOT: { id: modelId },
          name: updatedmodelData.name,
        },
      });

      if (modelWithSameName) {
        return res.status(409).json({ error: 'model with the same name already exists' });
      }
    }

    const model = await prisma.model.update({
      where: { id: modelId },
      data: updatedmodelData,
    });

    res.json(model); // Return the updated model
  } catch (error) {
    console.error('Error updating model:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/models/:id', async (req, res) => {
  const modelId = parseInt(req.params.id);

  try {
    // First, check if the model with the specified ID exists
    const existingmodel = await prisma.model.findUnique({
      where: { id: modelId },
    });

    if (!existingmodel) {
      return res.status(404).json({ message: 'model not found' });
    }


    // If the model exists, delete it
    await prisma.model.delete({
      where: { id: modelId },
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