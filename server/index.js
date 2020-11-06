const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./user/route');
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
});
class Server {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    await this.initDbConnection();
    this.initMiddleWares();
    this.intiRoutes();
    this.initErrorHandle();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }
  async initDbConnection() {
    try {
      mongoose.set('useCreateIndex', true);
      await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      });
      console.log('Database connection successful');
    } catch (error) {
      console.log('DB CONNECTION ERROR');

      process.exit(1);
    }
  }
  initMiddleWares() {
    this.server.use(express.json());
  }
  intiRoutes() {
    this.server.use('/api/auth', userRouter);
  }
  initErrorHandle() {
    this.server.use((err, req, res, next) => {
      const message = 'Oooops something went wrong. Try again later.';
      err.message = message;
      res.status(500).send(err);
    });
  }
  startListening() {
    this.server.listen(process.env.PORT || 3005, () => {
      console.log('start server');
    });
  }
}
const startServer = new Server();
startServer.start();
