import { Box, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import Loader from "../Loader";
import Todo from "./components/Todo.jsx";
import useGetTodos from "./hooks/useGetTodos.js";
import { LoadingButton } from "@mui/lab";
import useAddTodos from "./hooks/useAddTodo.js";
import { CustomSuccessAlert } from "../../utils/general.js";

const Todos = () => {
  let [todos, setTodos] = useState([]);
  let [newTodoTitle, setNewTodoTitle] = useState("");
  let [newTodoDescription, setNewTodoDescription] = useState("");

  const { isFetchingTodos } = useGetTodos(setTodos);
  const { addTodo, isAddingTodo, isAdded } = useAddTodos(setTodos);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTodo({ title: newTodoTitle, description: newTodoDescription });
    if (isAdded) {
      setNewTodoDescription("");
      setNewTodoTitle("");
      CustomSuccessAlert("New Todo Added");
    }
  };

  const isValidateInputs =
    newTodoTitle.length < 10 || newTodoDescription.length < 15;

  const renderTodos = todos?.map((todo) => (
    <Grid key={todo._id} item xs={2.4}>
      <Todo todo={todo} />
    </Grid>
  ));

  if (isFetchingTodos) return <Loader />;
  return (
    <Box>
      <Box
        component="form"
        sx={{
          width: "76.5%",
          margin: "2rem auto",
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
          height: "70px",
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          id="title"
          name="title"
          label="Todo Title"
          variant="outlined"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          error={newTodoTitle.length > 0 && newTodoTitle.length < 10}
          helperText={
            newTodoTitle.length > 0 && newTodoTitle.length < 10
              ? "Title must be at least 10 characters"
              : ""
          }
          sx={{ width: "35%" }}
        />
        <TextField
          id="description"
          name="description"
          label="Todo Description"
          variant="outlined"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          error={
            newTodoDescription.length > 0 && newTodoDescription.length < 15
          }
          helperText={
            newTodoDescription.length > 0 && newTodoDescription.length < 15
              ? "Description must be at least 15 characters"
              : ""
          }
          sx={{ width: "35%" }}
        />
        <LoadingButton
          loading={isAddingTodo}
          variant="contained"
          size="large"
          type="submit"
          disabled={isValidateInputs}
          sx={{ p: "14px" }}
        >
          Add Todo
        </LoadingButton>
      </Box>
      <Grid container spacing={4} width={"80%"} sx={{ margin: "1rem auto" }}>
        {renderTodos}
      </Grid>
    </Box>
  );
};

export default Todos;
