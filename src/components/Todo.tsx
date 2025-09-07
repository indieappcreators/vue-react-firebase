import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication } from '../firebase/auth';
import { createTodo, fetchAllTodos, deleteTodo } from '../firebase/todos';
import type { User, AuthState } from '../firebase/types';

const Todo: React.FC = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const [todos, setTodos] = useState<Record<string, any>>({});
  const [newTodoText, setNewTodoText] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = await checkAuthentication();
        setAuthState(authResult);
        
        if (authResult.isAuthenticated && authResult.user) {
          await loadTodos();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const loadTodos = async () => {
    if (!authState.user) return;
    
    try {
      const userTodos = await fetchAllTodos(authState.user.uid);
      setTodos(userTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim() || !authState.user) return;
    
    setIsAddingTodo(true);
    try {
      await createTodo({
        text: newTodoText.trim(),
        completed: false,
        owner: authState.user.uid
      });
      setNewTodoText('');
      await loadTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsAddingTodo(false);
    }
  };

  const removeTodo = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
      await loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const goToHome = () => {
    navigate('/');
  };

  const todoList = Object.entries(todos).map(([id, todo]) => ({ id, ...todo }));

  if (authState.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!authState.isAuthenticated || !authState.user) {
    return (
      <div>
        <p>Please log in to access todos.</p>
        <button onClick={goToHome}>Go Home</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Todo App</h1>
      
      <div>
        <h2>Add New Todo</h2>
        <form onSubmit={addTodo}>
          <input
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            type="text"
            placeholder="Enter todo text"
            required
            disabled={isAddingTodo}
          />
          <button type="submit" disabled={isAddingTodo || !newTodoText.trim()}>
            {isAddingTodo ? 'Adding...' : 'Add Todo'}
          </button>
        </form>
      </div>
      
      <div>
        <h2>Your Todos</h2>
        {todoList.length === 0 ? (
          <p>No todos yet. Add one above!</p>
        ) : (
          <div>
            {todoList.map(todo => (
              <div key={todo.id}>
                <span>{todo.text}</span>
                <button onClick={() => removeTodo(todo.id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <button onClick={goToHome}>Back to Home</button>
      </div>
    </div>
  );
};

export default Todo;
