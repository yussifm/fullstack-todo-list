import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import Todo from "./components/Todo.jsx";
import { LoadingButton } from "@mui/lab";
import useAddTodos from "./hooks/useAddTodo.js";
import { CustomSuccessAlert } from "../../utils/general.js";
import useGetTodos from "./hooks/useGetTodos.js";

const Todos = () => {
  let [todos, setTodos] = useState([]);
  let [newTodoTitle, setNewTodoTitle] = useState("");
  let [newTodoDescription, setNewTodoDescription] = useState("");
  let [page, setPage] = useState(1);
  let [limit, setLimit] = useState(5);
  let [numOfPages, setNumOfPages] = useState(10);

  const { fetchTodos, isFetchingTodos } = useGetTodos(setTodos, setNumOfPages);
  const { addTodo, isAddingTodo, isAdded } = useAddTodos(setTodos);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTodo({ title: newTodoTitle, description: newTodoDescription });
  };

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  const handleLimitChange = (e, { props }) => {
    const limit = props.value;
    setLimit(limit);
  };

  const isValidateInputs =
    newTodoTitle.length < 10 || newTodoDescription.length < 15;

  const renderTodos = todos?.map((todo) => (
    <Grid key={todo._id} item xs={2.4}>
      <Todo todo={todo} setTodos={setTodos} />
    </Grid>
  ));

  useEffect(() => {
    if (isAdded) {
      setNewTodoDescription("");
      setNewTodoTitle("");
      CustomSuccessAlert("New Todo added successfully");
    }
    fetchTodos(page, limit);
  }, [isAdded, page, limit]);

  if (isFetchingTodos) return <Loader />;
  return (
    <Box>
      <Box
        sx={{
          margin: "2rem auto",
          width: "76.5%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <Box
          component="form"
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexGrow: 1,
            height: "70px",
            gap: 4,
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
            sx={{
              width: "30%",
            }}
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
            sx={{
              flexGrow: 1,
            }}
          />
          <LoadingButton
            loading={isAddingTodo}
            variant="contained"
            size="large"
            type="submit"
            disabled={isValidateInputs}
            sx={{
              p: "14px",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            }}
          >
            Add Todo
          </LoadingButton>
        </Box>
        <Box
          sx={{
            maxWidth: 100,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Limit</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={limit}
              label="limit"
              onChange={handleLimitChange}
              sx={{
                height: "56px",
                textAlign: "center",
                width: "100px",
              }}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Grid
        container
        spacing={4}
        width={"80%"}
        sx={{ marginX: "auto", paddingBlockEnd: 15 }}
      >
        {renderTodos}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          py: 3,
          backgroundColor: "white",
        }}
      >
        <Pagination
          count={numOfPages}
          page={page}
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
};

export default Todos;
