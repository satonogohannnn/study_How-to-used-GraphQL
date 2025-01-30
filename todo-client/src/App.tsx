import { useState } from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { Button } from './components/ui/button';
import { gql, useQuery, useMutation } from "@apollo/client";

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

const ADD_TODO = gql`
  mutation AddTodo($title: String!) {
    addTodo(title: $title) {
      id
      title
      completed
    }
  }
`;

const UPDARE_TODO = gql`
  mutation UpdateTodo($id: ID!, $completed: Boolean!) {
    updateTodo(id: $id, completed: $completed) {
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
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDARE_TODO);
  const [title, setTitle] = useState("");

  const todos = data ? data.getTodos : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddTodo = async () => {
    await addTodo({
      variables: { title },
      refetchQueries: [{ query: GET_TODOS }]
    });
    setTitle("");
  }

  const handleUpdateTodo = async (id: string, completed: boolean) => {
    await updateTodo({
      variables: { id, completed: !completed },
      refetchQueries: [{ query: GET_TODOS }]
    })
  }

  return (
    <>
      <div>
        <h1>TO DO List</h1>
        <input type="text" placeholder="TODOを追加してください" />
        <button onClick={handleAddTodo}>追加</button>
        <ul>
          {todos.map((todo: Todo) => (
            <li
              key={todo.id}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleUpdateTodo(todo.id, todo.completed)}
              />
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