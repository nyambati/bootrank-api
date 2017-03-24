const app = require('./server');
const port = process.env.PORT;

app.listen(port, error => {
  if (error) throw error;
  /* eslint-disable no-console */
  console.log(`Running on http://localhost:${port} on ${app.get('env')} mode`);
});
