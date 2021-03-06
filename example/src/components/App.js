import React from 'react'
import Footer from './Footer'
import AddTodo from '../containers/AddTodo'
import VisibleTodoList from '../containers/VisibleTodoList'

const App = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
    <iframe title="sandbox" src="/iframe" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-scripts allow-same-origin" />
  </div>
)

export default App
