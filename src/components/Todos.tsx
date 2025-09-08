import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication } from '../firebase/auth';
import { createTodo, fetchAllTodos, deleteTodo, updateTodo } from '../firebase/todos';
import type { AuthState } from '../firebase/types';
import Nav from './Nav';

const Todo: React.FC = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const [todos, setTodos] = useState<Record<string, any>>({});
  const [newTodoText, setNewTodoText] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodoText, setEditingTodoText] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const loadTodos = async (user: any) => {
    if (!user) {
      console.log('loadTodos: No user provided');
      return;
    }
    
    try {
      console.log('loadTodos: Fetching todos for user:', user.uid);
      const userTodos = await fetchAllTodos(user.uid);
      console.log('loadTodos: Fetched todos:', userTodos);
      setTodos(userTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResult = await checkAuthentication();
        setAuthState(authResult);
        
        if (authResult.isAuthenticated && authResult.user) {
          await loadTodos(authResult.user);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

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
      await loadTodos(authState.user);
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsAddingTodo(false);
    }
  };

  const removeTodo = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
      await loadTodos(authState.user);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleTodoHandler = async (todoId: string) => {
    try {
      await updateTodo(todoId, { completed: !todos[todoId].completed });
      await loadTodos(authState.user);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const editTodoHandler = (todoId: string) => {
    setEditingTodoId(todoId);
    setEditingTodoText(todos[todoId].text);
  };

  const updateTodoHandler = async () => {
    if (!editingTodoId) {
      console.log('updateTodoHandler: No editingTodoId');
      return;
    }
    try {
      console.log('updateTodoHandler: Updating todo:', editingTodoId, 'with text:', editingTodoText);
      await updateTodo(editingTodoId, { text: editingTodoText });
      console.log('updateTodoHandler: Todo updated successfully');
      
      // Update local state immediately
      setTodos(prevTodos => ({
        ...prevTodos,
        [editingTodoId]: {
          ...prevTodos[editingTodoId],
          text: editingTodoText
        }
      }));
      
      setEditingTodoId(null);
      setEditingTodoText('');
      
      // Also refresh from server to ensure consistency
      console.log('updateTodoHandler: Calling loadTodos with user:', authState.user);
      await loadTodos(authState.user);
    } catch (error) {
      console.error('Error updating todo:', error);
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
      <Nav className="nav" />
      
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
              <div key={todo.id} className="todoItem">
                {editingTodoId === todo.id ? (
                  <>
                    <input type="checkbox" checked={todo.completed} onChange={() => toggleTodoHandler(todo.id)} />
                    <input 
                      type="text" 
                      value={editingTodoText} 
                      onChange={(e) => setEditingTodoText(e.target.value)}
                      className="todoItem-text" 
                    />
                    <button onClick={updateTodoHandler}>Save</button>
                    <button onClick={() => removeTodo(todo.id)}>Delete</button>
                  </>
                ) : (
                  <>
                    <input type="checkbox" checked={todo.completed} onChange={() => toggleTodoHandler(todo.id)} />
                    <p className="todoItem-text">{todo.text}</p>
                    <button onClick={() => editTodoHandler(todo.id)}>Edit</button>
                    <button onClick={() => removeTodo(todo.id)}>Delete</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;

// Add styles to match Vue version
const styles = `
  .todoItem {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .todoItem-text {
    min-width: 200px;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
