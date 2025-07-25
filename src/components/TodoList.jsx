import { useState, useEffect } from 'react';

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

function ColorSchemeSelector() {
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
    </div>
  );
}

function TodoList() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [alert, setAlert] = useState(null);
  const [pendingToggleTodo, setPendingToggleTodo] = useState(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const savedColorScheme = localStorage.getItem('colorScheme') || 'blue';
    document.documentElement.setAttribute('data-color-scheme', savedColorScheme);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      subtasks: []
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
    setDueDate('');
  };

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    // If the todo is already completed, allow unchecking without any prompts
    if (todo.completed) {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: false } : todo
      ));
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

    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const updatedTodo = { ...todo, completed: !todo.completed };
        // When marking as complete, also complete all subtasks
        if (!todo.completed) {
          updatedTodo.subtasks = todo.subtasks.map(subtask => ({
            ...subtask,
            completed: true
          }));
        }
        // When unmarking (marking as incomplete), don't change subtask states
        return updatedTodo;
      }
      return todo;
    }));
    
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

  const addSubtask = (todoId, subtaskText) => {
    if (!subtaskText.trim()) return;
    
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        const newSubtask = {
          id: Date.now(),
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
        <span className="title-text">My Beautiful Todo List</span>
        <span className="title-icon">✨</span>
      </h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          className="todo-input"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>

      {todos.length === 0 ? (
        <div className="empty-state">
          <p>No todos yet. Add one above to get started!</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
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
                <span className="todo-text">{todo.text}</span>
                {todo.dueDate && (
                  <span className="due-date">
                    Due: {formatDate(todo.dueDate)}
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
                aria-label="Delete todo"
              >
                ×
              </button>
              
              {todo.subtasks && todo.subtasks.length > 0 && (
                <SubtaskList
                  todoId={todo.id}
                  subtasks={todo.subtasks}
                  onAddSubtask={addSubtask}
                  onToggleSubtask={toggleSubtask}
                  onDeleteSubtask={deleteSubtask}
                />
              )}
              
              {(!todo.subtasks || todo.subtasks.length === 0) && (
                <SubtaskList
                  todoId={todo.id}
                  subtasks={[]}
                  onAddSubtask={addSubtask}
                  onToggleSubtask={toggleSubtask}
                  onDeleteSubtask={deleteSubtask}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      <ColorSchemeSelector />
    </div>
  );
}

export default TodoList;