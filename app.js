const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const locationRouter = require('./routes/locationRoutes');
const attendanceRouter = require('./routes/attendanceRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

const allowedOrigins = ['http://localhost:8100', 'http://localhost:8101', 'http://localhost', '*', 'http://panchats.com/*', 'http://5.189.142.196/*', 'http://5.189.142.196'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  headers: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.auth);
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/location', locationRouter);
app.use('/api/v1/attendance', attendanceRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
