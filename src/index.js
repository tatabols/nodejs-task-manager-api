const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// users endpoints
app.post('/users', (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
});

app.get('/users', (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }

      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
});

// tasks endpoints
app.post('/tasks', (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then((task) => res.status(201).send(task))
    .catch((err) => res.status(500).send({ message: err.message }));
});

app.get('/tasks', (req, res) => {
  Task.find({})
    .then((tasks) => res.status(200).send(tasks))
    .catch((err) => res.status(500).send({ message: err.message }));
});

app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then((task) => {
      if (!task) {
        return res.status(404).send();
      }

      res.status(200).send(task);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
});

app.listen(port, () => {
  console.log('server running in port ' + port);
});
