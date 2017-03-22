const app = require('./server');
const { connect } = require('./server/config');
const port = process.env.PORT

app.listen(port, error => {
  if (error) throw error
  console.log(`Running on http://localhost:${port} on ${app.get('env') } mode`);
});
