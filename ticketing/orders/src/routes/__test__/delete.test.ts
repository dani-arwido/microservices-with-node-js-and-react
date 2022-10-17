import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const createTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'abc',
    price: 123,
  });

  await ticket.save();

  return ticket;
};

it('Marks the ticket as cancelled', async () => {
  const ticket = await createTicket();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(204);

  const { body: response } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send();

  expect(response.status).toEqual(OrderStatus.Cancelled);
});

it('Emits order cancelled event', async () => {
  const ticket = await createTicket();
  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
