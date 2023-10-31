import {Router} from 'express';
import {Prisma, PrismaClient} from '@prisma/client';
const router = Router();
const prisma = new PrismaClient()

router.get('/carPublications', async (req,res) => {
  try {
    const carPublications = await prisma.carPublication.findMany()
    res.send(carPublications)
  } catch (error) {
    console.error('Error finding Car Publications:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
  
})

router.get('/carPublications/:id', async (req,res) => {
  try {
    const carPublication = await prisma.carPublication.findUnique({
      where: {id: parseInt(req.params.id)}
    });
    res.send(carPublication)
  } catch (error) {
    console.error('Error finding Car Publications:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.post('/carPublications', async (req, res) => {
  try {
    // Create the carPublication
    const carPublication = await prisma.carPublication.create({
      data: req.body
    });

    // Return the created carPublication
    res.status(201).json(carPublication);
  } catch (error) {
    console.error('Error creating Car Publication:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/carPublications/:id', async (req, res) => {
  const carPublicationId = parseInt(req.params.id);
  const updatedCarPublicationData = req.body;

  try {
    const carPublication = await prisma.carPublication.update({
      where: { id: carPublicationId },
      data: updatedCarPublicationData,
    });

    res.json(carPublication); // Return the updated carPublication
  } catch (error) {
    console.error('Error updating Car Publication:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/carPublications/:id', async (req, res) => {
  const carPublicationId = parseInt(req.params.id);

  try {
    // First, check if the carPublication with the specified ID exists
    const existingcarPublication = await prisma.carPublication.findUnique({
      where: { id: carPublicationId },
    });

    if (!existingcarPublication) {
      return res.status(404).json({ error: 'Car Publication not found' });
    }

    // If the carPublication exists, delete it
    await prisma.carPublication.delete({
      where: { id: carPublicationId },
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