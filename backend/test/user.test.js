const request = require('supertest');
const app = require('../index.js');
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');

describe('POST /api/login', () => {
  let user;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('testpassword', 10);

    user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user',
      },
    });
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  });

  it('should sign in successfully with correct credentials', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'testpassword',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Sign in successful');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should fail when email is missing', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ password: 'testpassword' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Please fill all the fields'
    );
  });

  it('should fail when password is missing', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Please fill all the fields'
    );
  });

  it('should fail when user does not exist', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'nonexistent@example.com',
      password: 'testpassword',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('should fail with wrong password', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid password');
  });
});

describe('POST /api/register', () => {
  afterAll(async () => {
    // Clean up any user created during tests
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['testregister@example.com', 'duplicate@example.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  it('should register a user successfully', async () => {
    const response = await request(app).post('/api/register').send({
      username: 'testuser',
      email: 'testregister@example.com',
      password: 'testpassword123',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'User created successfully'
    );
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty(
      'email',
      'testregister@example.com'
    );
  });

  it('should fail when email is missing', async () => {
    const response = await request(app).post('/api/register').send({
      username: 'testuser',
      password: 'testpassword123',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Please fill all the fields'
    );
  });

  // it('should fail when password is missing', async () => {
  //   const response = await request(app).post('/api/register').send({
  //     username: 'testuser',
  //     email: 'testregister2@example.com',
  //   });

  //   expect(response.statusCode).toBe(400);
  //   expect(response.body).toHaveProperty(
  //     'message',
  //     'Please fill all the fields'
  //   );
  // });

  it('should fail when username is missing', async () => {
    const response = await request(app).post('/api/register').send({
      email: 'testregister3@example.com',
      password: 'testpassword123',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      'message',
      'Please fill all the fields'
    );
  });
});
