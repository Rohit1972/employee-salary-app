const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;


app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));


const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String,
  salary: Number
});


const Employee = mongoose.model('Employee', employeeSchema);


app.post('/employees', async (req, res) => {
  const { name, position,department, salary } = req.body;

  if (!name || !position || !department|| !salary) {
    return res.status(400).json({ error: 'Name, position,department and salary are required.' });
  }

  const employee = new Employee({ name, position,department, salary });
  await employee.save();
  res.status(201).json(employee);
});


app.get('/employees', async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});


app.get('/employees/:id', async (req, res) => {
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return res.status(404).json({ error: 'Employee not found.' });
  }

  res.json(employee);
});


app.put('/employees/:id', async (req, res) => {
  const { name, position,department, salary } = req.body;

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { name, position,department, salary },
    { new: true, runValidators: true }
  );

  if (!employee) {
    return res.status(404).json({ error: 'Employee not found.' });
  }

  res.json(employee);
});


app.delete('/employees/:id', async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee) {
    return res.status(404).json({ error: 'Employee not found.' });
  }

  res.json({ message: 'Employee deleted successfully.' });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
