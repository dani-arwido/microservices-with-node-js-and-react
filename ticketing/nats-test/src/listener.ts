///<reference types="node" />;

import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');
  const ticketListener = new TicketCreatedListener(stan);

  ticketListener.listen();

  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true)
  //   .setDeliverAllAvailable()
  //   .setDurableName('service');

  // const subscription = stan.subscribe('ticket:created', queueGroup, options);

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();

  //   if (typeof data === 'string') {
  //     console.log(`Receive event #${msg.getSequence()}. with data: ${data}`);
  //   }

  //   msg.ack();
  // });
});

stan.on('close', () => {
  console.log('NATS connection closed!');
  process.exit();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
