import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import express from 'express';
import { currentUser, errorHandler, NotFoundError } from '@dt-tickets/common';
import { indexOrdersRouter } from './routes';
import { deleteOrdersRouter } from './routes/delete';
import { showOrdersRouter } from './routes/show';
import { newOrdersRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);
app.use(currentUser);

app.use(indexOrdersRouter);
app.use(newOrdersRouter);
app.use(showOrdersRouter);
app.use(deleteOrdersRouter);

app.get('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
