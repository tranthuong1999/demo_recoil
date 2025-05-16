import React from 'react';
import { useRecoilValue } from 'recoil';
import { todoListState } from '../recoil/atoms';
import TodoItem from './TodoItem';

export default function TodoList() {
  const todoList = useRecoilValue(todoListState);

  return (
    <ul>
      {todoList.map((item: any) => (
        <TodoItem key={item.id} todo={item} />
      ))}
    </ul>
  );
}
