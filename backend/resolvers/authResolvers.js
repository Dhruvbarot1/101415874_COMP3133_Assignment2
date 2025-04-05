const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'your_secret_key_here'; // store in .env in production

const authResolvers = {
  Mutation: {
    signup: async (_, { email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error('User already exists');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

      return { token, user };
    }
  }
};

module.exports = authResolvers;
