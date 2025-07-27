import { useState, useEffect } from 'react';
import { database, ref, set, get, onValue, off } from '../firebase.js';

function SubtaskItem({ subtask, todoId, onToggle, onDelete }) {
  return (
    <div className="subtask-item">
      <input
        type="checkbox"
        checked={subtask.completed}
        onChange={() => onToggle(todoId, subtask.id)}
        className="subtask-checkbox"
      />
      <span className={`subtask-text ${subtask.completed ? 'completed' : ''}`}>
        {subtask.text}
      </span>
      <button
        onClick={() => onDelete(todoId, subtask.id)}
        className="delete-subtask-button"
        aria-label="Delete subtask"
      >
        ×
      </button>
    </div>
  );
}

function SubtaskList({ todoId, subtasks, onAddSubtask, onToggleSubtask, onDeleteSubtask }) {
  const [subtaskInput, setSubtaskInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAddSubtask = (e) => {
    e.preventDefault();
    onAddSubtask(todoId, subtaskInput);
    setSubtaskInput('');
  };

  const completedCount = subtasks.filter(st => st.completed).length;
  const totalCount = subtasks.length;

  return (
    <div className="subtask-container">
      <button 
        className="subtask-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'} Subtasks ({completedCount}/{totalCount})
      </button>
      
      {isExpanded && (
        <div className="subtask-list">
          {subtasks.map(subtask => (
            <SubtaskItem
              key={subtask.id}
              subtask={subtask}
              todoId={todoId}
              onToggle={onToggleSubtask}
              onDelete={onDeleteSubtask}
            />
          ))}
          
          <form onSubmit={handleAddSubtask} className="subtask-form">
            <input
              type="text"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              placeholder="Add a subtask..."
              className="subtask-input"
            />
            <button type="submit" className="add-subtask-button">+</button>
          </form>
        </div>
      )}
    </div>
  );
}

function Alert({ message, type = 'success', onConfirm, onCancel }) {
  return (
    <div className="alert-overlay">
      <div className={`alert alert-${type}`}>
        <div className="alert-icon">
          {type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
        </div>
        <div className="alert-content">
          <h3 className="alert-title">
            {type === 'warning' ? '⚠️ Irreversible Action!' : '🎉 Task Complete!'}
          </h3>
          <p className="alert-message">{message}</p>
          <div className="alert-actions">
            <button 
              className="alert-button alert-confirm"
              onClick={onConfirm}
            >
              {type === 'warning' ? 'Yes, mark all complete' : 'Got it!'}
            </button>
            {onCancel && (
              <button 
                className="alert-button alert-cancel"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ColorSchemeSelector({ progress = 0 }) {
  const colorSchemes = [
    { name: 'blue', color: '#3b82f6' },
    { name: 'green', color: '#10b981' },
    { name: 'purple', color: '#8b5cf6' },
    { name: 'orange', color: '#f59e0b' },
    { name: 'pink', color: '#ec4899' },
    { name: 'red', color: '#ef4444' },
    { name: 'teal', color: '#14b8a6' },
    { name: 'indigo', color: '#6366f1' }
  ];

  const [selectedScheme, setSelectedScheme] = useState(() => {
    return localStorage.getItem('colorScheme') || 'blue';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-color-scheme', selectedScheme);
    localStorage.setItem('colorScheme', selectedScheme);
  }, [selectedScheme]);

  return (
    <div className="color-scheme-selector">
      <span className="color-scheme-label">Color:</span>
      <div className="color-scheme-options">
        {colorSchemes.map((scheme) => (
          <button
            key={scheme.name}
            className={`color-scheme-option ${selectedScheme === scheme.name ? 'active' : ''}`}
            style={{ backgroundColor: scheme.color }}
            onClick={() => setSelectedScheme(scheme.name)}
            title={scheme.name.charAt(0).toUpperCase() + scheme.name.slice(1)}
            aria-label={`Select ${scheme.name} color scheme`}
          />
        ))}
      </div>

      <div className="progress-wrapper">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
        <span className="progress-label">{progress}% complete</span>
      </div>
    </div>
  );
}

function TodoList() {
  const [user, setUser] = useState('');
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [alert, setAlert] = useState(null);
  const [pendingToggleTodo, setPendingToggleTodo] = useState(null);
  const [tag, setTag] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [filter, setFilter] = useState('all');
  const [sortMode, setSortMode] = useState('created');
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ text: '', dueDate: '', tag: '', recurrence: 'none' });

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('username', user);
    } else {
      localStorage.removeItem('username');
    }
  }, [user]);

  // Load todos from Firebase
  useEffect(() => {
    if (!user) return;

    const todosRef = ref(database, `todos/${user}`);
    
    const handleDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const todosArray = Object.values(data).map(todo => ({
          ...todo,
          subtasks: todo.subtasks || [],
          dueDate: todo.dueDate || null,
          tag: todo.tag || '',
          recurrence: todo.recurrence || 'none',
          notified: todo.notified || false
        }));
        setTodos(todosArray);
      } else {
        setTodos([]);
      }
    };

    onValue(todosRef, handleDataChange);

    return () => {
      const todosRef = ref(database, `todos/${user}`);
      off(todosRef, 'value', handleDataChange);
    };
  }, [user]);

  // Save todos to Firebase
  useEffect(() => {
    if (!user) return;

    const todosRef = ref(database, `todos/${user}`);
    const todosObject = {};
    todos.forEach(todo => {
      todosObject[todo.id] = todo;
    });
    set(todosRef, todosObject);
  }, [todos, user]);

  useEffect(() => {
    const savedColorScheme = localStorage.getItem('colorScheme') || 'blue';
    document.documentElement.setAttribute('data-color-scheme', savedColorScheme);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Notification.permission !== 'granted') return;
      setTodos(tds =>
        tds.map(t => {
          if (!t.completed && t.dueDate && !t.notified) {
            const time = new Date(t.dueDate) - new Date();
            if (time > 0 && time < 60000) {
              new Notification('Todo Due', { body: t.text });
              return { ...t, notified: true };
            }
          }
          return t;
        })
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem('username', user);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setAlert({
        type: 'warning',
        message: 'Please sign in with your name before adding tasks.'
      });
      return;
    }
    if (!inputValue.trim()) return;

    const newTodo = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      subtasks: [],
      tag: tag || '',
      recurrence,
      notified: false
    };

    setTodos([...todos, newTodo]);
    setInputValue('');
    setDueDate('');
    setTag('');
    setRecurrence('none');
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // If the todo is already completed, allow unchecking without any prompts
    if (todo.completed) {
      setTodos(todos.map(t => {
        if (t.id === id) {
          const updated = { ...t, completed: false };
          if (t.recurrence !== 'none' && t.dueDate) {
            const next = new Date(t.dueDate);
            if (t.recurrence === 'daily') next.setDate(next.getDate() + 1);
            if (t.recurrence === 'weekly') next.setDate(next.getDate() + 7);
            if (t.recurrence === 'monthly') next.setMonth(next.getMonth() + 1);
            const newTodo = {
              ...t,
              id: crypto.randomUUID(),
              completed: false,
              dueDate: next.toISOString().slice(0, 10),
              createdAt: new Date().toISOString(),
              notified: false
            };
            return [updated, newTodo];
          }
          return updated;
        }
        return t;
      }).flat());
      return;
    }

    // For incomplete todos, check if there are subtasks to handle
    const hasSubtasks = todo.subtasks && todo.subtasks.length > 0;
    const hasIncompleteSubtasks = hasSubtasks && todo.subtasks.some(st => !st.completed);

    if (hasIncompleteSubtasks) {
      setPendingToggleTodo(id);
      setAlert({
        type: 'warning',
        message: `This will mark "${todo.text}" and all ${todo.subtasks.length} subtasks as complete. This action cannot be undone.`
      });
    } else {
      completeTodoAndSubtasks(id);
    }
  };

  const completeTodoAndSubtasks = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setTodos(todos.map(t => {
      if (t.id === id) {
        const updatedTodo = { ...t, completed: !t.completed };
        // When marking as complete, also complete all subtasks
        if (!t.completed) {
          updatedTodo.subtasks = t.subtasks.map(subtask => ({
            ...subtask,
            completed: true
          }));
          // Handle recurrence for completed tasks
          if (t.recurrence !== 'none' && t.dueDate) {
            const next = new Date(t.dueDate);
            if (t.recurrence === 'daily') next.setDate(next.getDate() + 1);
            if (t.recurrence === 'weekly') next.setDate(next.getDate() + 7);
            if (t.recurrence === 'monthly') next.setMonth(next.getMonth() + 1);
            const newTodo = {
              ...t,
              id: crypto.randomUUID(),
              completed: false,
              dueDate: next.toISOString().slice(0, 10),
              createdAt: new Date().toISOString(),
              notified: false
            };
            return [updatedTodo, newTodo];
          }
        }
        // When unmarking (marking as incomplete), don't change subtask states
        return updatedTodo;
      }
      return t;
    }).flat());
    
    // Only show success message when marking as complete
    if (!todo.completed) {
      setAlert({
        type: 'success',
        message: `🎉 Task completed successfully! All subtasks have been marked as complete.`
      });
    }
    
    setPendingToggleTodo(null);
  };

  const handleAlertConfirm = () => {
    if (alert?.type === 'warning') {
      completeTodoAndSubtasks(pendingToggleTodo);
    } else {
      setAlert(null);
    }
  };

  const handleAlertCancel = () => {
    setAlert(null);
    setPendingToggleTodo(null);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditValues({
      text: todo.text,
      dueDate: todo.dueDate || '',
      tag: todo.tag || '',
      recurrence: todo.recurrence || 'none'
    });
  };

  const saveEdit = (id) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, ...editValues } : t
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const addSubtask = (todoId, subtaskText) => {
    if (!subtaskText.trim()) return;
    
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        const newSubtask = {
          id: crypto.randomUUID(),
          text: subtaskText,
          completed: false,
          createdAt: new Date().toISOString()
        };
        return { ...todo, subtasks: [...todo.subtasks, newSubtask] };
      }
      return todo;
    }));
  };

  const toggleSubtask = (todoId, subtaskId) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: todo.subtasks.map(subtask =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          )
        };
      }
      return todo;
    }));
  };

  const deleteSubtask = (todoId, subtaskId) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: todo.subtasks.filter(subtask => subtask.id !== subtaskId)
        };
      }
      return todo;
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !isToday(dueDate);
  };

  const isToday = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return today.toDateString() === due.toDateString();
  };

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const displayTodos = filtered.sort((a, b) => {
    if (sortMode === 'due') {
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const completedCount = todos.filter(t => t.completed).length;
  const progress = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="todo-container">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onConfirm={handleAlertConfirm}
          onCancel={alert.type === 'warning' ? handleAlertCancel : undefined}
        />
      )}
      <h1 className="app-title">
        <span className="title-icon">✨</span>
        <span className="title-text">Todo List</span>
        <span className="title-icon">✨</span>
      </h1>

      {!user ? (
        <form className="signin-form" onSubmit={(e) => { e.preventDefault(); if (usernameInput.trim()) { setUser(usernameInput.trim()); setUsernameInput(''); } }}>
          <input 
            className="signin-input" 
            value={usernameInput} 
            onChange={(e) => setUsernameInput(e.target.value)} 
            placeholder="Enter your name" 
            required
            minLength={1}
            maxLength={50}
          />
          <button type="submit" className="add-button">Get Started - JPHsystems</button>
        </form>
      ) : (
        <div className="user-bar">
          <span>Welcome, {user}!</span>
          <button className="delete-button" onClick={() => { setUser(''); }}>Sign Out</button>
        </div>
      )}
      
      {user && (
        <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <div className="todo-form-fields">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Tag"
            className="todo-input"
          />
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="date-input"
          >
            <option value="none">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button type="submit" className="add-button">Add</button>
        </div>
      </form>
      )}

      {user && (
      <div className="filter-bar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="date-input">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sortMode} onChange={(e) => setSortMode(e.target.value)} className="date-input">
          <option value="created">Created</option>
          <option value="due">Due Date</option>
        </select>
      </div>
      )}

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>{!user ? 'Sign in to start adding tasks!' : 'No todos yet. Add one above to get started!'}</p>
        </div>
      ) : (
        <ul className="todo-list">
          {displayTodos.map(todo => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''} ${
                isOverdue(todo.dueDate) ? 'overdue' : ''
              } ${isToday(todo.dueDate) ? 'due-today' : ''}`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <div className="todo-content">
                {editingId === todo.id ? (
                  <>
                    <input
                      className="todo-input"
                      value={editValues.text}
                      onChange={(e) => setEditValues({ ...editValues, text: e.target.value })}
                    />
                    <input
                      type="date"
                      className="date-input"
                      value={editValues.dueDate}
                      onChange={(e) => setEditValues({ ...editValues, dueDate: e.target.value })}
                    />
                    <input
                      className="todo-input"
                      value={editValues.tag}
                      onChange={(e) => setEditValues({ ...editValues, tag: e.target.value })}
                      placeholder="Tag"
                    />
                    <select
                      className="date-input"
                      value={editValues.recurrence}
                      onChange={(e) => setEditValues({ ...editValues, recurrence: e.target.value })}
                    >
                      <option value="none">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </>
                ) : (
                  <>
                    <span className="todo-text">{todo.text}</span>
                    {todo.tag && (
                      <span className="due-date">Tag: {todo.tag}</span>
                    )}
                    {todo.dueDate && (
                      <span className="due-date">
                        Due: {formatDate(todo.dueDate)}
                      </span>
                    )}
                  </>
                )}
              </div>
              <button
                onClick={() => (editingId === todo.id ? saveEdit(todo.id) : startEdit(todo))}
                className="delete-button"
                aria-label="Edit todo"
              >
                {editingId === todo.id ? 'Save' : 'Edit'}
              </button>
              {editingId === todo.id && (
                <button className="delete-button" onClick={cancelEdit}>Cancel</button>
              )}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
                aria-label="Delete todo"
              >
                ×
              </button>
              
              <SubtaskList
                todoId={todo.id}
                subtasks={todo.subtasks || []}
                onAddSubtask={addSubtask}
                onToggleSubtask={toggleSubtask}
                onDeleteSubtask={deleteSubtask}
              />
            </li>
          ))}
        </ul>
      )}

  {user && (
        <ColorSchemeSelector progress={progress} />
      )}
    </div>
  );
}

export default TodoList;