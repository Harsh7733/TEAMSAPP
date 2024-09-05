const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const PORT = 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const DATA_FILE = './data.json';

// Read data
app.get('/task', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    try {
      res.send(JSON.parse(data));
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      res.status(500).send({ message: 'Error processing data' });
    }
  });
});

// Add data
app.post('/task', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    try {
      const tasks = JSON.parse(data);
      const newTask = { id: Date.now(), ...req.body };
      tasks.push(newTask);
      fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
          console.error('Error writing to data file:', err);
          return res.status(500).send({ message: 'Error saving task' });
        }
        res.status(201).send(newTask);
      });
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      res.status(500).send({ message: 'Error processing data' });
    }
  });
});

// Update data
app.put('/task/:id', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    try {
      const tasks = JSON.parse(data);
      const taskId = parseInt(req.params.id, 10);
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...req.body } : task
      );
      fs.writeFile(DATA_FILE, JSON.stringify(updatedTasks, null, 2), (err) => {
        if (err) {
          console.error('Error writing to data file:', err);
          return res.status(500).send({ message: 'Error updating task' });
        }
        const updatedTask = updatedTasks.find(task => task.id === taskId);
        if (updatedTask) {
          res.send(updatedTask); // Return updated task
        } else {
          res.status(404).send({ message: 'Task not found' });
        }
      });
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      res.status(500).send({ message: 'Error processing data' });
    }
  });
});

// Delete data
app.delete('/task/:id', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data file:', err);
      return res.status(500).send({ message: 'Internal Server Error' });
    }
    try {
      const tasks = JSON.parse(data);
      const taskId = parseInt(req.params.id, 10);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      fs.writeFile(DATA_FILE, JSON.stringify(updatedTasks, null, 2), (err) => {
        if (err) {
          console.error('Error writing to data file:', err);
          return res.status(500).send({ message: 'Error deleting task' });
        }
        res.send({ message: 'Task deleted' });
      });
    } catch (parseErr) {
      console.error('Error parsing JSON data:', parseErr);
      res.status(500).send({ message: 'Error processing data' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
