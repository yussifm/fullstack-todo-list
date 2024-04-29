import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { Circle, CircleCheckBig, Trash2 } from "lucide-react";
import React from "react";
import useUpdateTodo from "../hooks/useUpdateTodo.js";
import { LoadingButton } from "@mui/lab";
import useDeleteTodo from "../hooks/useDeleteTodo.js";

const Todo = ({ todo, setTodos }) => {
  const { _id, title, description, isCompleted } = todo;

  const { updateTodo, isUpdatingTodo } = useUpdateTodo(setTodos);
  const { deleteTodo, isDeletingTodo } = useDeleteTodo(setTodos);

  const handleUpdate = async (todo) => {
    await updateTodo(todo);
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
  };

  return (
    <Card sx={{ maxWidth: 250 }}>
      <Stack justifyContent={"space-between"} boxSizing={"border-box"}>
        <CardContent
          sx={{
            paddingBlockEnd: 0,
            position: "relative",
          }}
        >
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            align="center"
            mt={1}
          >
            {title}
          </Typography>
          <Typography variant="body1" my={2}>
            {description}
          </Typography>
          <Typography
            variant="body1"
            color={isCompleted ? "green" : "red"}
            sx={{ position: "absolute", top: 5, left: 5 }}
          >
            {isCompleted ? (
              <CircleCheckBig color="rgb(103, 172, 0)" />
            ) : (
              <Circle color="rgb(184, 184, 184)" />
            )}
          </Typography>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <LoadingButton
            size="medium"
            variant="contained"
            disabled={isCompleted}
            loading={isUpdatingTodo}
            onClick={() => handleUpdate(todo)}
          >
            Mark as Done
          </LoadingButton>
          <LoadingButton
            size="medium"
            variant="contained"
            color="error"
            loading={isDeletingTodo}
            onClick={() => handleDelete(_id)}
          >
            <Trash2 />
          </LoadingButton>
        </CardActions>
      </Stack>
    </Card>
  );
};

export default Todo;
