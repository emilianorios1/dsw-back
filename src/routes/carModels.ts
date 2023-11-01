import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/carModels', async (req,res) => {
  try {
    const carModels = await prisma.carModel.findMany({
      include: {
        brand: true, // Include the brand information
      },
    });

    res.send(carModels)
  } catch (error) {
    console.error('Error finding Car Models:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/carModels/:id', async (req,res) => {
  try {
    const carModel = await prisma.carModel.findUnique({
      where: {id: parseInt(req.params.id)}
    });
    res.send(carModel)
  } catch (error) {
    console.error('Error finding Car Models:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/carModels', async (req, res) => {
  try {
    // Validate and sanitize the request data
    const { name } = req.body;
    
    // Check if the carModel with the same name already exists
    const existingcarModel = await prisma.carModel.findUnique({
      where: { name: name },
    });

    if (existingcarModel) {
      return res.status(409).json({ error: 'Car Model with the same name already exists' });
    }
    
    // Create the carModel
    const carModel = await prisma.carModel.create({
      data: req.body
    });

    // Return the created carModel
    res.status(201).json(carModel);
  } catch (error) {
    console.error('Error creating Car Model:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/carModels/:id', async (req, res) => {
  const carModelId = parseInt(req.params.id);
  const updatedcarModelData = req.body;

  try {
    const existingcarModel = await prisma.carModel.findUnique({
      where: { id: carModelId },
    });

    if (!existingcarModel) {
      return res.status(404).json({ error: 'Car Model not found' });
    }

    // Check if the updated name already exists in another carModel
    if (updatedcarModelData.name) {
      const carModelWithSameName = await prisma.carModel.findFirst({
        where: {
          NOT: { id: carModelId },
          name: updatedcarModelData.name,
        },
      });

      if (carModelWithSameName) {
        return res.status(409).json({ error: 'Car Model with the same name already exists' });
      }
    }

    const carModel = await prisma.carModel.update({
      where: { id: carModelId },
      data: updatedcarModelData,
    });

    res.json(carModel); // Return the updated carModel
  } catch (error) {
    console.error('Error updating Car Model:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/carModels/:id', async (req, res) => {
  const carModelId = parseInt(req.params.id);

  try {
    // First, check if the carModel with the specified ID exists
    const existingcarModel = await prisma.carModel.findUnique({
      where: { id: carModelId },
    });

    if (!existingcarModel) {
      return res.status(404).json({ error: 'Car Model not found' });
    }

    const dependantCarPublications = await prisma.carPublication.findMany({
      where: {carModelId: carModelId}
    })

    if (dependantCarPublications.length > 0) {
      return res.status(404).json({ error: 'Please delete dependant car publications before deleting this model.'})
    }

    // If the carModel exists, delete it
    await prisma.carModel.delete({
      where: { id: carModelId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;