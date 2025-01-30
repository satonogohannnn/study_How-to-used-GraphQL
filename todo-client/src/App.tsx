import { useState } from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";
import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Checkbox } from './components/ui/checkbox';

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

const UPDATE_TODO = gql`
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
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [title, setTitle] = useState("");

  const todos = data ? data.getTodos : [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddTodo = async () => {
    if (title === "") return

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
      <div className='min-h-screen bg-gradiet-to-br from-teal-50 tomint-100 flex item-center justify-center p-4'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden'
        >
          <div className='bg-gradient-to-r from-teal-400 te-emerald-500 p-6'>
            <h1 className='text-3xl font-bold text-white mb-2'>TO DO List</h1>
          </div>
          <div className='p-6'>
            <div className='flex mb-4'>
              <input
                type="text"
                placeholder='タスクを追加'
                value={title}
                onChange={(e: any) => setTitle(e.target.value)}
                className='flex-grow mr-2 bg-teal-50 border-teal-200 focus: ring-2 focus:border-transparent'
              />
              <Button
                onClick={handleAddTodo}
                className='bg-emerald-500 hover: bg-emerald-600 text-white'
              >
                <PlusCircle className='w-5 h-5' />
              </Button>
            </div>

            <AnimatePresence>
              {todos.map((todo: Todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: 20}}
                  animate={{ opacity: 1, y: 0}}
                  exit={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center mb-4 p-4 rounded-lg shadow-sm ${todo.completed ? "bg-mint-100" : "bg-white"}`}
                >
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleUpdateTodo(todo.id, todo.completed)}
                    className='mr-3 border-teal-400 text-teal-500'
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`flex-grow text-lg ${todo.completed ? "line-through text-teal-600" : "text-gray-800"}`}
                  >
                    {todo.title}
                  </label>
                  {todo.completed && (<CheckCircle2 className='w-5 h-5 text-teal-500 ml-2' />)}
                </motion.div>
              ))}
            </AnimatePresence>
            {todos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-center text-teal-600 mt-6'
              >
                タスクがありません
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default App;