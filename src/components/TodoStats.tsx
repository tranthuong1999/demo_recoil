import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { todoListState } from '../recoil/atoms';

export default function TodoStats() {
  // Example 1: useRecoilState - can both read and write
  const [todoList, setTodoList] = useRecoilState(todoListState);
  
  // Example 2: useRecoilValue - can only read
  const todoListReadOnly = useRecoilValue(todoListState);
  
  // Example 3: useSetRecoilState - can only write
  const setTodoListWriteOnly = useSetRecoilState(todoListState);

  const clearAllTodos = () => {
    setTodoList([]); // Using useRecoilState setter
  };

  const addDummyTodo = () => {
    setTodoListWriteOnly((oldList) => [
      ...oldList,
      { id: Date.now(), text: 'Dummy Todo', completed: false }
    ]);
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc' }}>
      <h3>Todo Stats Demo</h3>
      
      {/* Using useRecoilState - can read and write */}
      <div>
        <h4>Using useRecoilState:</h4>
        <p>Total todos: {todoList.length}</p>
        <button onClick={clearAllTodos}>Clear All (using useRecoilState)</button>
      </div>

      {/* Using useRecoilValue - can only read */}
      <div>
        <h4>Using useRecoilValue:</h4>
        <p>Total todos (read-only): {todoListReadOnly.length}</p>
        {/* Can't modify the state here */}
      </div>

      {/* Using useSetRecoilState - can only write */}
      <div>
        <h4>Using useSetRecoilState:</h4>
        <button onClick={addDummyTodo}>Add Dummy Todo (using useSetRecoilState)</button>
        {/* Can't read the state here */}
      </div>
    </div>
  );
} 