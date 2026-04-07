const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Pet = require('../models/Pet');

describe('Booking API', () => {
  let userToken;
  let userId;
  let petId;

  beforeEach(async () => {
    // Create a user and get token
    const user = await User.create({
      name: 'Booking User',
      email: 'booking@example.com',
      password: 'Password123!',
      role: 'user',
    });
    userId = user._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'booking@example.com', password: 'Password123!' });

    userToken = loginRes.headers['set-cookie'];

    // Create a pet for the user
    const pet = await Pet.create({
      name: 'Buddy',
      type: 'Dog',
      owner: userId,
      breed: 'Golden Retriever',
      age: 3,
    });
    petId = pet._id;
  });

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const bookingData = {
        pet: petId,
        service: 'Walking',
        startDate: new Date(Date.now() + 86400000), // tomorrow
        endDate: new Date(Date.now() + 86436000), // tomorrow + 1 hour
        totalPrice: 25,
      };

      const res = await request(app)
        .post('/api/bookings')
        .set('Cookie', userToken)
        .send(bookingData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.pet).toEqual(petId.toString());
    });

    it('should prevent double-booking for the same pet and time', async () => {
      const startDate = new Date(Date.now() + 172800000); // 2 days later
      const endDate = new Date(Date.now() + 172836000);

      await Booking.create({
        user: userId,
        pet: petId,
        service: 'Walking',
        startDate,
        endDate,
        totalPrice: 25,
        status: 'confirmed',
      });

      const res = await request(app).post('/api/bookings').set('Cookie', userToken).send({
        pet: petId,
        service: 'Boarding',
        startDate,
        endDate,
        totalPrice: 50,
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/already booked/i);
    });
  });
});
