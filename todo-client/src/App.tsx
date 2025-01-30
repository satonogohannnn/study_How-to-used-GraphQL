import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Button } from './components/ui/button';
import { gql, useQuery } from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache()
});

const GET_TODOS = gql`
  query {
    getTodos {
      id
      title
      completed
    }
  }
`;

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

function App() {
  const { loading, error, data } = useQuery(GET_TODOS, {
    fetchPolicy: "network-only",
  });

  const todos = data ? data.getTodos : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div>
        <h1>TO DO List</h1>
        <input type="text" placeholder="TODOを追加してください" />
        <button>追加</button>
        <ul>
          {todos.map((todo: Todo) => (
            <li
              key={todo.id}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              <input type="checkbox" checked={todo.completed} />
              {todo.title}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default function AppWrapper() {
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
}