import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

interface Event {
  subject: Subjects;
  data: TicketCreatedEvent['data'];
}

export abstract class BasePublisher<T extends Event> {
  abstract subject: T['subject'];
  constructor(private client: Stan) {}

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          reject();
        }
        console.log('Event published');
        resolve();
      });
    });
  }
}
