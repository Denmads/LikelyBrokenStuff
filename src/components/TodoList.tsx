import { useState, useEffect } from 'react'
import '../styles/TodoList.css'

interface Todo {
  id: string
  text: string
  completed: boolean
}

const STORAGE_KEY = 'likelyBroken_todos'
const SHUFFLE_INTERVAL = 30000 // Shuffle every 30 seconds

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')

  // Load todos from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTodos(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load todos', e)
      }
    }
  }, [])

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  // Set up shuffling interval
  useEffect(() => {
    const interval = setInterval(() => {
      setTodos(prevTodos => {
        if (prevTodos.length <= 1) return prevTodos
        const shuffled = [...prevTodos]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        return shuffled
      })
    }, SHUFFLE_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false
      }
      setTodos([...todos, newTodo])
      setInputValue('')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const completedCount = todos.filter(todo => todo.completed).length

  return (
    <div className="todo-list-container">
      <div className="todo-header">
        <h1>My Todo List</h1>
      </div>

      <form onSubmit={addTodo} className="todo-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-button">Add Task</button>
      </form>

      <div className="todo-stats">
        <span>{todos.length} total</span>
        <span>{completedCount} completed</span>
        {completedCount > 0 && (
          <button onClick={clearCompleted} className="clear-button">
            Clear Completed
          </button>
        )}
      </div>

      <div className="todo-items">
        {todos.length === 0 ? (
          <p className="empty-message">No tasks yet. Add one to get started! ✨</p>
        ) : (
          <ul>
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className="todo-text">{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TodoList
