import { useState } from "react";
import { CustomErrorAlert } from "../../../utils/general.js";

const useDeleteTodo = (setTodos) => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteTodo = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://fullstack-todolist-upnv.onrender.com/todos/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTodos((prevTodos) => prevTodos.filter((item) => item._id !== id));
    } catch (error) {
      CustomErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteTodo, isDeletingTodo: isLoading };
};

export default useDeleteTodo;
