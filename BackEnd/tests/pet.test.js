const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Pet = require('../models/Pet');

describe('Pet API', () => {
  let userToken;
  let userId;
  let adminToken;

  beforeEach(async () => {
    // Create a user and get token
    const user = await User.create({
      name: 'Pet Owner',
      email: 'owner@example.com',
      password: 'Password123!',
      role: 'user'
    });
    userId = user._id;

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'owner@example.com', password: 'Password123!' });
    userToken = loginRes.headers['set-cookie'];

    // Create an admin and get token
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin'
    });

    const adminLoginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Password123!' });
    adminToken = adminLoginRes.headers['set-cookie'];
  });

  describe('POST /api/pets', () => {
    it('should create a pet successfully', async () => {
      const petData = {
        name: 'Max',
        type: 'Dog',
        breed: 'Beagle',
        age: 2
      };

      const res = await request(app)
        .post('/api/pets')
        .set('Cookie', userToken)
        .send(petData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.name).toEqual('Max');
      expect(res.body.owner).toEqual(userId.toString());
    });
  });

  describe('GET /api/pets/user', () => {
    it('should get all pets for the logged-in user', async () => {
      await Pet.create({ name: 'Max', type: 'Dog', owner: userId });
      await Pet.create({ name: 'Bella', type: 'Cat', owner: userId });

      const res = await request(app)
        .get('/api/pets/user')
        .set('Cookie', userToken);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe('DELETE /api/pets/:id', () => {
    it('should allow owner to delete their pet', async () => {
      const pet = await Pet.create({ name: 'Max', type: 'Dog', owner: userId });

      const res = await request(app)
        .delete(`/api/pets/${pet._id}`)
        .set('Cookie', userToken);

      expect(res.statusCode).toEqual(200);
      
      const deletedPet = await Pet.findById(pet._id);
      expect(deletedPet.isDeleted).toBe(true); // Assuming soft delete based on route comment
    });

    it('should prevent other users from deleting the pet', async () => {
      const pet = await Pet.create({ name: 'Max', type: 'Dog', owner: userId });
      
      // Create another user
      await User.create({ name: 'Other', email: 'other@example.com', password: 'Password123!' });
      const otherLogin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'other@example.com', password: 'Password123!' });
      const otherToken = otherLogin.headers['set-cookie'];

      const res = await request(app)
        .delete(`/api/pets/${pet._id}`)
        .set('Cookie', otherToken);

      expect(res.statusCode).toEqual(403); // Or 401/404 depending on implementation
    });
  });
});
