import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import API from "@api";
import "./KanbanLeads.css";

export default function KanbanLeads({ leads, setLeads, onEditLead, onDeleteLead }) {
  const statusColumns = {
    new: "New",
    contacted: "Contacted",
    meeting: "Meeting Scheduled",
    proposal: "Proposal Sent",
    closed: "Closed",
    lost: "Not Relevant",
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const draggedLead = leads.find((l) => l._id === draggableId);
    if (!draggedLead) return;

    try {
      const res = await API.patch(`/crm-extras/leads/${draggableId}`, {
        ...draggedLead,
        status: destination.droppableId,
      });
      setLeads((prev) => prev.map((l) => (l._id === draggableId ? res.data : l)));
    } catch (err) {
      console.error("Error updating lead status", err);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {Object.entries(statusColumns).map(([status, label]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                <h4>{label}</h4>
                <div className="kanban-tasks">
                  {leads
                    .filter((l) => l.status === status)
                    .map((lead, index) => (
                      <Draggable key={lead._id} draggableId={lead._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            className={`kanban-card ${snapshot.isDragging ? "dragging" : ""}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <strong>{lead.name}</strong>
                            {lead.phone && <p>📞 {lead.phone}</p>}
                            {lead.email && <p>📧 {lead.email}</p>}
                            {lead.source && <small>Source: {lead.source}</small>}
                            <div className="actions">
                              <button className="edit" onClick={() => onEditLead(lead)}>✏️</button>
                              <button className="delete" onClick={() => onDeleteLead(lead._id)}>🗑️</button>
                              <button onClick={() => window.open(`tel:${lead.phone}`)}>☎️</button>
                              <button onClick={() => window.open(`https://wa.me/${lead.phone}`)}>💬</button>
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
