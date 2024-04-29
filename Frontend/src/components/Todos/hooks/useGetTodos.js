import { useState, useEffect } from "react";

const useGetTodos = () => {
  const [todos, setTodos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(
        "https://fullstack-todolist-upnv.onrender.com/todos"
      );
      const data = await response.json();
      setTodos(data.todos);
      setIsLoading(false);
    };

    fetchTodos();
  }, []);

  return { todos, isLoading };
};

export default useGetTodos;
