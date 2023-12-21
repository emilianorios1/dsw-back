import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
import { checkAdmin, checkAuth } from '../middleware/auth';
const router = Router();
const prisma = new PrismaClient()

router.get('', async (req,res) => {
  try {
    const boatModels = await prisma.boatModel.findMany({
      include: {
        brand: true, // Include the brand information
      },
    })
    res.send(boatModels)
  } catch (error) {
    console.error('Error finding Boat Models:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
  
})

router.get('/:id', async (req,res) => {
  try {
    const boatModel = await prisma.boatModel.findUnique({
      where: {id: parseInt(req.params.id)}
    });
    res.send(boatModel)
  } catch (error) {
    console.error('Error finding Boat Models:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('', checkAuth, checkAdmin, async (req, res) => {
  try {
    // Validate and sanitize the request data
    const { name } = req.body;
    
    // Check if the boatModel with the same name already exists
    const existingboatModel = await prisma.boatModel.findUnique({
      where: { name: name },
    });

    if (existingboatModel) {
      return res.status(409).json({ error: 'Boat Model with the same name already exists' });
    }
    
    // Create the boatModel
    const boatModel = await prisma.boatModel.create({
      data: req.body
    });

    // Return the created boatModel
    res.status(201).json(boatModel);
  } catch (error) {
    console.error('Error creating Boat Model:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/:id', checkAuth, checkAdmin, async (req, res) => {
  const boatModelId = parseInt(req.params.id);
  const updatedboatModelData = req.body;

  try {
    const existingboatModel = await prisma.boatModel.findUnique({
      where: { id: boatModelId },
    });

    if (!existingboatModel) {
      return res.status(404).json({ error: 'Boat Model not found' });
    }

    // Check if the updated name already exists in another boatModel
    if (updatedboatModelData.name) {
      const boatModelWithSameName = await prisma.boatModel.findFirst({
        where: {
          NOT: { id: boatModelId },
          name: updatedboatModelData.name,
        },
      });

      if (boatModelWithSameName) {
        return res.status(409).json({ error: 'Boat Model with the same name already exists' });
      }
    }

    const boatModel = await prisma.boatModel.update({
      where: { id: boatModelId },
      data: updatedboatModelData,
    });

    res.json(boatModel); // Return the updated boatModel
  } catch (error) {
    console.error('Error updating Boat Model:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', checkAuth, checkAdmin, async (req, res) => {
  const boatModelId = parseInt(req.params.id);

  try {
    // First, check if the boatModel with the specified ID exists
    const existingboatModel = await prisma.boatModel.findUnique({
      where: { id: boatModelId },
    });

    if (!existingboatModel) {
      return res.status(404).json({ error: 'Boat Model not found' });
    }

    const dependantBoatPublications = await prisma.boatPublication.findMany({
      where: {boatModelId: boatModelId}
    })

    if (dependantBoatPublications.length > 0) {
      return res.status(404).json({ error: 'Please delete dependant boat publications before deleting this model.'})
    }

    // If the boatModel exists, delete it
    await prisma.boatModel.delete({
      where: { id: boatModelId },
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