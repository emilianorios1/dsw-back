import { Router } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

router.get('/cars', async (req, res) => {
  const cars = await prisma.car.findMany();
  res.send(cars);
});

router.get('/cars/:id', async (req, res) => {
  const car = await prisma.car.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  res.send(car);
});

router.post('/cars', async (req, res) => {
  try {
    // Validate and sanitize the request data
    const { model, manufacturer, year, price, color } = req.body;
    

    if (!model) {
      return res.status(400).json({ error: 'Model is required' });
    }

    // Check if the car with the same model already exists
    const existingCar = await prisma.car.findUnique({
      where: { model: model },
    });

    if (existingCar) {
      return res.status(409).json({ error: 'Car with the same model already exists' });
    }

    // Create the car
    const car = await prisma.car.create({
      data: {
        model: model,
        manufacturer: manufacturer,
        year  : year,
        price  : price,
        color: color,
        // Other fields if necessary
      }
    });

    // Return the created car
    res.status(201).json(car);
  } catch (error) {
    console.error('Error creating car:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/cars/:id', async (req, res) => {
  const carId = parseInt(req.params.id);
  const updatedCarData = req.body;

  try {
    const existingCar = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!existingCar) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Check if the updated model already exists in another car
    if (updatedCarData.model) {
      const carWithSamemodel = await prisma.car.findFirst({
        where: {
          NOT: { id: carId },
          model: updatedCarData.model,
        },
      });

      if (carWithSamemodel) {
        return res.status(409).json({ error: 'Car with the same model already exists' });
      }
    }

    const car = await prisma.car.update({
      where: { id: carId },
      data: updatedCarData,
    });

    res.json(car); // Return the updated car
  } catch (error) {
    console.error('Error updating car:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ error: error.message });
    }

    // Handle other errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/cars/:id', async (req, res) => {
  const carId = parseInt(req.params.id);

  try {
    // First, check if the car with the specified ID exists
    const existingCar = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!existingCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // If the car exists, delete it
    await prisma.car.delete({
      where: { id: carId },
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
