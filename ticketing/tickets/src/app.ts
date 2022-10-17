import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import express from 'express';
import { currentUser, errorHandler, NotFoundError } from '@dt-tickets/common';
import { createTicketsRouter } from './routes/new';
import { showTicketsRouter } from './routes/show';
import { indexTicketsRouter } from './routes/index';
import { updateTicketsRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);
app.use(currentUser);

app.use(createTicketsRouter);
app.use(showTicketsRouter);
app.use(indexTicketsRouter);
app.use(updateTicketsRouter);

app.get('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
