import React, { useState } from 'react';
import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil';
import { todoListState } from '../recoil/atoms';

let id = 0; // ID tăng dần

export default function TodoInput() {
  const [input, setInput] = useState('');
  const setTodoList = useSetRecoilState(todoListState);
  const todoList = useRecoilValue(todoListState);
  // const [todoList, setTodoList] = useRecoilState(todoListState);

  const addTodo = () => {
    if (input.trim() === '') return;
    setTodoList((oldList: any) => [
      ...oldList,
      {
        id: id++,
        text: input,
        completed: false,
      },
    ]);
    setInput('');
  };

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập việc cần làm"
      />
      <button onClick={addTodo}>Thêm</button>
      <p>Current todos: {todoList.length}</p>
    </div>
  );
}
