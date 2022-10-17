import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@dt-tickets/common';
import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get(
  '/api/tickets/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return next(new NotFoundError());
    }

    res.status(200).send(ticket);
  }
);

export { router as showTicketsRouter };
