import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/planeModels', async (req,res) => {
  try {
    const planeModels = await prisma.planeModel.findMany(
      {include: {
      brand: true, // Include the brand information
    },
    }
  )
    res.send(planeModels)
  } catch (error) {
    console.error('Error finding Plane Models:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
  
})

router.get('/planeModels/:id', async (req,res) => {
  try {
    const planeModel = await prisma.planeModel.findUnique({
      where: {id: parseInt(req.params.id)}
    });
    res.send(planeModel)
  } catch (error) {
    console.error('Error finding Plane Models:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/planeModels', async (req, res) => {
  try {
    // Validate and sanitize the request data
    const { name } = req.body;
    
    // Check if the planeModel with the same name already exists
    const existingplaneModel = await prisma.planeModel.findUnique({
      where: { name: name },
    });

    if (existingplaneModel) {
      return res.status(409).json({ error: 'Plane Model with the same name already exists' });
    }
    
    // Create the planeModel
    const planeModel = await prisma.planeModel.create({
      data: req.body
    });

    // Return the created planeModel
    res.status(201).json(planeModel);
  } catch (error) {
    console.error('Error creating Plane Model:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/planeModels/:id', async (req, res) => {
  const planeModelId = parseInt(req.params.id);
  const updatedplaneModelData = req.body;

  try {
    const existingplaneModel = await prisma.planeModel.findUnique({
      where: { id: planeModelId },
    });

    if (!existingplaneModel) {
      return res.status(404).json({ error: 'Plane Model not found' });
    }

    // Check if the updated name already exists in another planeModel
    if (updatedplaneModelData.name) {
      const planeModelWithSameName = await prisma.planeModel.findFirst({
        where: {
          NOT: { id: planeModelId },
          name: updatedplaneModelData.name,
        },
      });

      if (planeModelWithSameName) {
        return res.status(409).json({ error: 'Plane Model with the same name already exists' });
      }
    }

    const planeModel = await prisma.planeModel.update({
      where: { id: planeModelId },
      data: updatedplaneModelData,
    });

    res.json(planeModel); // Return the updated planeModel
  } catch (error) {
    console.error('Error updating Plane Model:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/planeModels/:id', async (req, res) => {
  const planeModelId = parseInt(req.params.id);

  try {
    // First, check if the planeModel with the specified ID exists
    const existingplaneModel = await prisma.planeModel.findUnique({
      where: { id: planeModelId },
    });

    if (!existingplaneModel) {
      return res.status(404).json({ error: 'Plane Model not found' });
    }

    const dependantPlanePublications = await prisma.planePublication.findMany({
      where: {planeModelId: planeModelId}
    })

    if (dependantPlanePublications.length > 0) {
      return res.status(404).json({ error: 'Please delete dependant plane publications before deleting this model.'})
    }

    // If the planeModel exists, delete it
    await prisma.planeModel.delete({
      where: { id: planeModelId },
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