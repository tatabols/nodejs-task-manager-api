const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log('server running in port ' + port);
});
