const express = require('express');
const Task = require('../models/task');
const auth = require('../middlewares/auth');

const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id,
    });

    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  try {
    const bodyKeys = Object.keys(req.body);
    const schemaKeys = Object.keys(Task.schema.tree);
    const isValidInputKeys = bodyKeys.every((k) => schemaKeys.includes(k));

    if (!isValidInputKeys) {
      return res.status(500).send({ error: 'Invalid data.' });
    }

    const task = await Task.find({ _id: req.params.id, owner: req.user._id });
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

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
