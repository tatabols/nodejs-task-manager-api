const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');

const { setupDatabase, userOneId, userOne, userTwo } = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'charles',
      email: 'charles@gmail.com',
      password: 'password1',
    })
    .expect(201);

  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: 'charles',
      email: 'charles@gmail.com',
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe('password1');
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);

  expect(response.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userTwo.email,
      password: userTwo.password,
    })
    .expect(401);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401);
});

test('should delete account for authorized user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);

  expect(user).toBeNull();
});

test('should not delete account for unauthorized user', async () => {
  await request(app).delete('/users/me').send().expect(401);
});
