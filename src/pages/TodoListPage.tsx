import TodoList from '../components/TodoList'
import Navbar from '../components/Navbar'

function TodoListPage() {
  return (
    <div className="app">
      <Navbar />

      <TodoList />
    </div>
  )
}

export default TodoListPage
