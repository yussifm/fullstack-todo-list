import { useState, useEffect } from "react";

const useGetTodos = (setTodos) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(
        "https://fullstack-todolist-upnv.onrender.com/todos?page=1&limit=1000"
      );
      const data = await response.json();
      setTodos(data.todos);
      setIsLoading(false);
    };

    fetchTodos();
  }, []);

  return { isFetchingTodos: isLoading };
};

export default useGetTodos;
