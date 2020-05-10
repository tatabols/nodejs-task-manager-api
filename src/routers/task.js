const express = require('express');
const Task = require('../models/task');

const router = new express.Router();

router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch('/tasks/:id', async (req, res) => {
  try {
    const bodyKeys = Object.keys(req.body);
    const schemaKeys = Object.keys(Task.schema.tree);
    const isValidInputKeys = bodyKeys.every((k) => schemaKeys.includes(k));

    if (!isValidInputKeys) {
      return res.status(500).send({ error: 'Invalid data.' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }

    bodyKeys.map((field) => (task[field] = req.body[field]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
