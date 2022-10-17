import {
  BaseListener,
  NotFoundError,
  Subjects,
  TicketCreatedEvent,
} from '@dt-tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, price, title } = data;

    const ticket = Ticket.build({ id, price, title });
    await ticket.save();

    msg.ack();
  }
}
