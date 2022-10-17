import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
  return await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'asdas', price: 123213 })
    .expect(201);
};

it('Returns lists of tickets', async () => {
  createTicket();
  createTicket();
  createTicket();

  const response = await request(app)
    .get('/api/tickets')
    .set('Cookie', global.signin())
    .send();

  expect(response.status).toEqual(200);
  expect(response.body.length).toEqual(3);
});
