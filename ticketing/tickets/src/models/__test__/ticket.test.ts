import { Ticket } from '../ticket';

it('implement concurrency control', async () => {
  const ticket = Ticket.build({
    userId: 'asdsadsad',
    price: 100,
    title: '123',
  });

  await ticket.save();

  const ticketOne = await Ticket.findById(ticket.id);
  const ticketTwo = await Ticket.findById(ticket.id);

  ticketOne!.set({ price: 999 });
  ticketTwo!.set({ price: 9 });

  await ticketOne!.save();

  await expect(ticketTwo!.save()).rejects.toThrow();
});

it('implement concurrency control', async () => {
  const ticket = Ticket.build({
    userId: 'asdsadsad',
    price: 100,
    title: '123',
  });

  await ticket.save();

  const ticketOne = await Ticket.findById(ticket.id);
  const ticketTwo = await Ticket.findById(ticket.id);

  ticketOne!.set({ price: 999 });
  ticketTwo!.set({ price: 9 });

  await ticketOne!.save();

  await expect(ticketTwo!.save()).rejects.toThrow();
});
