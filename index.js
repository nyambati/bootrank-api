const app = require('./server');
const port = process.env.PORT

app.listen(port || 3000);
console.log(`Running on http://localhost:${port}`);
