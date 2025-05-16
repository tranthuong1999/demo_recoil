import React from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import TodoStats from './components/TodoStats';
import AtomDemo from './components/AtomDemo';
import DenoChart from './components/Chart';
function App() {
  return (
    <>
      <h1>ToDo List 📝</h1>
      <DenoChart />
      {/* <TodoInput />
      <TodoList />
      <TodoStats />
      <AtomDemo /> */}
    </>
  );
}

export default App;
