import { Grid } from "@mui/material";
import React from "react";
import Loader from "../Loader";
import Todo from "./components/Todo.jsx";
import useGetTodos from "./hooks/useGetTodos.js";

const Todos = () => {
  const { todos, isLoading } = useGetTodos();

  if (isLoading) return <Loader />;
  return (
    <Grid container spacing={4} width={"80%"} sx={{ margin: "1rem auto" }}>
      {todos &&
        todos.map((todo) => (
          <Grid key={todo._id} item xs={2.4}>
            <Todo todo={todo} />
          </Grid>
        ))}
    </Grid>
  );
};

export default Todos;
