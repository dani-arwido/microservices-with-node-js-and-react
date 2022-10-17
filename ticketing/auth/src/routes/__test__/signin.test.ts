import request from 'supertest';
import { app } from '../../app';

it('Fails when an email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'P@ssw0rd' })
    .expect(400);
});

it('Fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'P@ssw0rd' })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'P@ssw0rd!' })
    .expect(400);
});

it('Success signin', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'P@ssw0rd' })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'P@ssw0rd' })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
