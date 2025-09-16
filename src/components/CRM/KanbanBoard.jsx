import React, { useState, useEffect } from "react";
import API from "@api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./KanbanBoard.css";

export default function KanbanBoard({ clientId, businessId }) {
  const [tasks, setTasks] = useState([]);

  const statusColumns = {
    todo: "לביצוע",
    in_progress: "בתהליך",
    waiting: "ממתין",
    completed: "הושלם",
    cancelled: "בוטל",
  };

  useEffect(() => {
    if (!clientId) return;
    API.get(`/crm-extras/tasks/${clientId}`, { params: { businessId } })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("שגיאה בשליפת משימות", err));
  }, [clientId, businessId]);

  // פונקציה לגרירה
  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    // לא זז
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const draggedTask = tasks.find((t) => t._id === draggableId);
    if (!draggedTask) return;

    // עדכון סטטוס בשרת
    try {
      const res = await API.patch(`/crm-extras/tasks/${draggableId}`, {
        ...draggedTask,
        status: destination.droppableId,
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === draggableId ? res.data : t))
      );
    } catch (err) {
      console.error("שגיאה בעדכון סטטוס", err);
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
                            className={`kanban-card ${task.priority} ${
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
                              <small>
                                {new Date(task.dueDate).toLocaleString("he-IL", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </small>
                            )}
                            <div className="actions">
                              <button className="edit">✏️</button>
                              <button className="delete">🗑️</button>
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
