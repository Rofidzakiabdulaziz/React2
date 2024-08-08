import React, { useState, useEffect } from 'react';


function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
  
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Update localStorage and state with new value
  const setValue = value => {
    try {
      // Allow value to be a function to update state based on previous value
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Main TodoApp component
function TodoApp() {
  // Initialize state using useLocalStorage custom hook
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [newTodo, setNewTodo] = useState('');

  // Add new todo to list
  const addTodo = () => {
    setTodos([...todos, { text: newTodo, completed: false }]);
    setNewTodo(''); // Clear input field after adding todo
  };

  // Toggle todo completion status
  const toggleTodo = index => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  // Remove todo from list
  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div>
      <h1>Todo List</h1>
      {/* Input field to add new todo */}
      <input
        type="text"
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
      />
      {/* Button to add new todo */}
      <button onClick={addTodo}>Add Todo</button>
      {/* Display list of todos */}
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {/* Todo item with click handler to toggle completion */}
            <span
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(index)}
            >
              {todo.text}
            </span>
            {/* Button to delete todo */}
            <button onClick={() => removeTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;