import { BasePublisher, OrderCreatedEvent, Subjects } from '@dt-tickets/common';

export class OrderCreatedPublish extends BasePublisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
