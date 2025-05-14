const request = require('supertest');
const app = require('../index.js');
const prisma = require('../prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('PUT /api/updateRole', () => {
  let token;
  let userId;

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        username: 'updateroleuser',
        email: 'updaterole@example.com',
        password: await bcrypt.hash('testpassword123', 15),
        role: 'student',
      },
    });

    userId = user.id;

    token = jwt.sign(
      { id: userId, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: 'updaterole@example.com',
      },
    });
    await prisma.$disconnect();
  });

  it('should update user role to teacher successfully', async () => {
    const response = await request(app)
      .put('/api/updateRole')
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Role updated successfully to TEACHER'
    );

    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    expect(updatedUser.role).toBe('teacher');
  });

  it('should fail if no token is provided', async () => {
    const response = await request(app).put('/api/updateRole').send();

    expect(response.statusCode).toBe(401);
  });

  it('should fail if invalid token is provided', async () => {
    const response = await request(app)
      .put('/api/updateRole')
      .set('Authorization', `Bearer invalidtoken`)
      .send();

    expect(response.statusCode).toBe(400);
  });
});

test / teacherController.test.js;
