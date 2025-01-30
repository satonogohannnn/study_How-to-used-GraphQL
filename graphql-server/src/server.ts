import { ApolloServer, gql } from "apollo-server";

const todos = [
  {
    id: "1",
    title: "GraphQLを勉強する",
    completed: false,
  },
  {
    id: "2",
    title: "Reactを勉強する",
    completed: false,
  },
];

const typeDefs = gql`
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    getTodos: [Todo!]!
  }
`;

const resolvers = {
  Query: {
    getTodos: () => todos,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});