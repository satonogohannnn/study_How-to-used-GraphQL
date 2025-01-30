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

  type Mutation {
    addTodo(title: String!): Todo!
  }
`;

const resolvers = {
  Query: {
    getTodos: () => todos,
  },

  Mutation: {
    addTodo: (_: unknown, { title }: { title: string }) => {
        const newTodo = {
            id: String(todos.length + 1),
            title,
            completed: false,
        };
        todos.push(newTodo);
        return newTodo;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});