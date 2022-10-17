import {
  BasePublisher,
  OrderCancelledEvent,
  Subjects,
} from '@dt-tickets/common';

export class OrderCancelledPublish extends BasePublisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
