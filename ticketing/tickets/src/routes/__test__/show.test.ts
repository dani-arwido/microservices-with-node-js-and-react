import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('Returns 404 if ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('Returns the ticket if the ticket is found', async () => {
  const title = 'asdas';

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price: 123213 })
    .expect(201);

  await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);
});
