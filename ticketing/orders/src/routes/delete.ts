import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@dt-tickets/common';
import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderCancelledPublish } from '../events/publisher/order-cancelled-publish';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) return next(new NotFoundError());

    if (order.userId !== req.currentUser!.id)
      return next(new NotAuthorizedError());

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublish(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrdersRouter };
