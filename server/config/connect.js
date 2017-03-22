'use strict';
module.exports = (mongoose, database_url) => {
  mongoose.connect(database_url);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('connected', () => {
    console.log('Connecton to mongo database established');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose disconnected through app termination');
      process.exit(0);
    });
  });
};
