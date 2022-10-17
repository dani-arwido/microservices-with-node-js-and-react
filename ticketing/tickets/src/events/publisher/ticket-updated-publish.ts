import {
  BasePublisher,
  Subjects,
  TicketUpdatedEvent,
} from '@dt-tickets/common';

export class TicketUpdatedPublish extends BasePublisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
