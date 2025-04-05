const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    department: String!
    position: String!
    profilePicture: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    getEmployees: [Employee]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    signup(email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    addEmployee(
      firstName: String!
      lastName: String!
      email: String!
      department: String!
      position: String!
      profilePicture: String
    ): Employee

    updateEmployee(
      id: ID!
      firstName: String
      lastName: String
      email: String
      department: String
      position: String
      profilePicture: String
    ): Employee

    deleteEmployee(id: ID!): Boolean
  }
`;

module.exports = typeDefs;
