///<reference types="node" />;

import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const data = {
    id: '123',
    title: 'cncert',
    price: 213213,
  };

  try {
    await new TicketCreatedPublisher(stan).publish(data);
  } catch (err) {
    console.log(err);
  }
});
