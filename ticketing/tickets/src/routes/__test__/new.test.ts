import request from 'supertest';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('Has route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send();

  expect(response.status).not.toEqual(404);
});

it('Can only be access if the user is signed in', async () => {
  return request(app).post('/api/tickets').send().expect(401);
});

it('Returns status other than 401 if user signin', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send();

  expect(response.status).not.toEqual(401);
});

it('Returns error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ price: 213213 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: '', price: 213213 })
    .expect(400);
});

it('Returns error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ price: -213 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'asdas' })
    .expect(400);
});

it('Creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'asdas', price: 123213 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it('Publish an event', async () => {
  let tickets = await Ticket.find({});

  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'asdas', price: 123213 })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
