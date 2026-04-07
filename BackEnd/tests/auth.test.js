const request = require('supertest');
const app = require('../server'); // We need to export app from server.js
const User = require('../models/User');

describe('Auth API', () => {
  const userData = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('email', userData.email.toLowerCase());
      expect(res.body).toHaveProperty('token'); // Based on sendTokenResponse in controller

      const user = await User.findOne({ email: userData.email.toLowerCase() });
      expect(user).toBeTruthy();
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({ name: 'Test' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 400 if user already exists', async () => {
      await User.create(userData);
      const res = await request(app).post('/api/auth/register').send(userData);

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create(userData);
    });

    it('should login successfully with valid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: userData.email,
        password: userData.password,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('email', userData.email.toLowerCase());
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: userData.email,
        password: 'wrongpassword',
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body.type).toEqual('auth');
    });
  });
});
