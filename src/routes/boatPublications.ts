import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/boatPublications', async (req,res) => {
  try {
    const boatPublications = await prisma.boatPublication.findMany({
      include:{
      boatModel: {
        include:{
          brand: true
        }
      },
    }})
    res.send(boatPublications)
  } catch (error) {
    console.error('Error finding Boat Publications:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
  
})

router.get('/boatPublications/:id', async (req,res) => {
  try {
    const boatPublication = await prisma.boatPublication.findUnique({
      where: {id: parseInt(req.params.id)}
    });
    res.send(boatPublication)
  } catch (error) {
    console.error('Error finding Boat Publications:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/boatPublications', async (req, res) => {
  try {
    // Create the boatPublication
    const boatPublication = await prisma.boatPublication.create({
      data: req.body
    });

    // Return the created boatPublication
    res.status(201).json(boatPublication);
  } catch (error) {
    console.error('Error creating Boat Publication:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/boatPublications/:id', async (req, res) => {
  const boatPublicationId = parseInt(req.params.id);
  const updatedBoatPublicationData = req.body;

  try {
    const boatPublication = await prisma.boatPublication.update({
      where: { id: boatPublicationId },
      data: updatedBoatPublicationData,
    });

    res.json(boatPublication); // Return the updated boatPublication
  } catch (error) {
    console.error('Error updating Boat Publication:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/boatPublications/:id', async (req, res) => {
  const boatPublicationId = parseInt(req.params.id);

  try {
    // First, check if the boatPublication with the specified ID exists
    const existingboatPublication = await prisma.boatPublication.findUnique({
      where: { id: boatPublicationId },
    });

    if (!existingboatPublication) {
      return res.status(404).json({ error: 'Boat Publication not found' });
    }

    // If the boatPublication exists, delete it
    await prisma.boatPublication.delete({
      where: { id: boatPublicationId },
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