import { useState } from "react";

const useGetTodos = (setTodos, setNumOfPages) => {
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async (page, limit) => {
    const response = await fetch(
      `https://fullstack-todolist-upnv.onrender.com/todos?page=${page}&limit=${limit}`
    );
    const data = await response.json();
    setTodos(data.todos);
    setNumOfPages(data.numOfPages);
    setIsLoading(false);
  };

  return { fetchTodos, isFetchingTodos: isLoading };
};

export default useGetTodos;
