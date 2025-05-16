import React from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { todoListState, Todo } from '../recoil/atoms';

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  const setTodoList = useSetRecoilState(todoListState);

  const toggleComplete = () => {
    setTodoList((list: any) =>
      list.map((item: any) =>
        item.id === todo.id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = () => {
    setTodoList((list: any) => list.filter((item: any) => item.id !== todo.id));
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={deleteItem}>Xóa</button>
    </li>
  );
}
