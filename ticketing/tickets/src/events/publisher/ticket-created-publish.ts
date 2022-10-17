import {
  BasePublisher,
  Subjects,
  TicketCreatedEvent,
} from '@dt-tickets/common';

export class TicketCreatedPublish extends BasePublisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
