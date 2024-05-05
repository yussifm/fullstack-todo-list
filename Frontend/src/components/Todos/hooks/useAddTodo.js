import { useState } from "react";

const useAddTodos = (setTodos) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addTodo = async (todo) => {
    setIsAdded(false);
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://fullstack-todolist-upnv.onrender.com/todos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTodos((prevTodos) => [...prevTodos, data.todo]);
      setIsAdded(true);
    } catch (error) {
      CustomErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { addTodo, isAddingTodo: isLoading, isAdded };
};

export default useAddTodos;
