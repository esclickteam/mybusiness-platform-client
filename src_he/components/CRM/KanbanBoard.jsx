import React, { useState, useEffect } from "react";
import API from "@api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./KanbanBoard.css";

export default function KanbanBoard({ clientId, businessId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const statusColumns = {
    todo: "To Do",
    in_progress: "In Progress",
    waiting: "Waiting",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  // === Fetch tasks ===
  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    API.get(`/crm-extras/tasks/${clientId}`, { params: { businessId } })
      .then((res) => {
        setTasks(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks");
      })
      .finally(() => setLoading(false));
  }, [clientId, businessId]);

  // === Dragging handler ===
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = tasks.find((t) => t._id === draggableId);
    if (!draggedTask) return;

    try {
      const res = await API.patch(`/crm-extras/tasks/${draggableId}`, {
        ...draggedTask,
        status: destination.droppableId,
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === draggableId ? res.data : t))
      );
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  // === Date formatter ===
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {Object.entries(statusColumns).map(([status, label]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h4>{label}</h4>

                {loading && <p className="loading">Loading...</p>}
                {error && <p className="error">{error}</p>}

                <div className="kanban-tasks">
                  {tasks
                    .filter((t) => t.status === status)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            className={`kanban-card ${task.priority || ""} ${
                              snapshot.isDragging ? "dragging" : ""
                            }`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <strong>{task.title}</strong>
                            {task.description && (
                              <p className="desc">{task.description}</p>
                            )}
                            {task.dueDate && (
                              <small>{formatDate(task.dueDate)}</small>
                            )}
                            <div className="actions">
                              <button className="edit" title="Edit task">
                                ✏️
                              </button>
                              <button className="delete" title="Delete task">
                                🗑️
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
