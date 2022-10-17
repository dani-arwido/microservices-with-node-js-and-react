import { TicketUpdatedEvent } from '@dt-tickets/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'New',
    price: 50,
  });

  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'Update',
    version: ticket.version + 1,
    price: 100,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  const msg: Partial<Message> = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it('finds, updates, and saves ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg as Message);

  const updateTicket = await Ticket.findById(ticket.id);

  expect(updateTicket!.price).toEqual(data.price);
  expect(updateTicket!.version).toEqual(data.version);
});

it('Acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg as Message);

  expect(msg.ack).toHaveBeenCalled();
});

it('Does not acks the message', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  await expect(listener.onMessage(data, msg as Message)).rejects.toThrow();

  expect(msg.ack).not.toHaveBeenCalled();
});
