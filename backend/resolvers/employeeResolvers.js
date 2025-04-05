const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const employeeResolvers = {
  Query: {
    getEmployees: async () => {
      try {
        return await Employee.find();
      } catch (err) {
        throw new Error('Error fetching employees: ' + err.message);
      }
    },

    getEmployee: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) throw new Error('Employee not found');
        return employee;
      } catch (err) {
        throw new Error('Error fetching employee: ' + err.message);
      }
    },
  },

  Mutation: {
    signup: async (_, { email, password }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
          { userId: newUser._id, email: newUser.email },
          'your_jwt_secret', // Replace this in production with env variable
          { expiresIn: '1h' }
        );

        return {
          token,
          user: newUser
        };
      } catch (err) {
        throw new Error('Error signing up: ' + err.message);
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error('Invalid credentials');

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          'your_jwt_secret',
          { expiresIn: '1h' }
        );

        return {
          token,
          user
        };
      } catch (err) {
        throw new Error('Error logging in: ' + err.message);
      }
    },

    addEmployee: async (_, args) => {
      try {
        const newEmployee = new Employee(args);
        await newEmployee.save();
        return newEmployee;
      } catch (err) {
        throw new Error('Error adding employee: ' + err.message);
      }
    },

    updateEmployee: async (_, args) => {
      try {
        const employee = await Employee.findById(args.id);
        if (!employee) throw new Error('Employee not found');

        Object.assign(employee, args); // Merge updated fields
        await employee.save();
        return employee;
      } catch (err) {
        throw new Error('Error updating employee: ' + err.message);
      }
    },

    deleteEmployee: async (_, { id }) => {
      try {
        const deleted = await Employee.findByIdAndDelete(id);
        if (!deleted) throw new Error('Employee not found');
        return true;
      } catch (err) {
        throw new Error('Error deleting employee: ' + err.message);
      }
    },
  }
};

module.exports = employeeResolvers;
