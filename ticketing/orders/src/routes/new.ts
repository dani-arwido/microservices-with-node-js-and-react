import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@dt-tickets/common';
import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { OrderCreatedPublish } from '../events/publisher/order-created-publish';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticketid must be provided'),
  ],
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ticketId } = req.body;
    console.log('asd');
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new NotFoundError());
    }

    const isReserved = await ticket.isReserved();

    if (isReserved) return next(new BadRequestError('Ticket not available'));

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiredAt: expiration,
      ticket,
    });

    await order.save();
    await new OrderCreatedPublish(natsWrapper.client).publish({
      id: order.id,
      expiredAt: order.expiredAt.toISOString(),
      status: order.status,
      userId: order.userId,
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrdersRouter };
