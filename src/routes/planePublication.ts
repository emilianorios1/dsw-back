import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/planePublications', async (req,res) => {
  try {
    const planePublications = await prisma.planePublication.findMany()
    res.send(planePublications)
  } catch (error) {
    console.error('Error finding Plane Publications:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
  
})

router.get('/planePublications/:id', async (req,res) => {
  try {
    const planePublication = await prisma.planePublication.findUnique({
      where: {id: parseInt(req.params.id)}
    });
    res.send(planePublication)
  } catch (error) {
    console.error('Error finding Plane Publications:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/planePublications', async (req, res) => {
  try {
    // Create the planePublication
    const planePublication = await prisma.planePublication.create({
      data: req.body
    });

    // Return the created planePublication
    res.status(201).json(planePublication);
  } catch (error) {
    console.error('Error creating Plane Publication:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/planePublications/:id', async (req, res) => {
  const planePublicationId = parseInt(req.params.id);
  const updatedPlanePublicationData = req.body;

  try {
    const planePublication = await prisma.planePublication.update({
      where: { id: planePublicationId },
      data: updatedPlanePublicationData,
    });

    res.json(planePublication); // Return the updated planePublication
  } catch (error) {
    console.error('Error updating Plane Publication:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/planePublications/:id', async (req, res) => {
  const planePublicationId = parseInt(req.params.id);

  try {
    // First, check if the planePublication with the specified ID exists
    const existingplanePublication = await prisma.planePublication.findUnique({
      where: { id: planePublicationId },
    });

    if (!existingplanePublication) {
      return res.status(404).json({ message: 'Plane Publication not found' });
    }

    // If the planePublication exists, delete it
    await prisma.planePublication.delete({
      where: { id: planePublicationId },
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