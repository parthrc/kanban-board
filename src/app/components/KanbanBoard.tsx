"use client";
import PlusIcon from "@/icons/PlusIcon";
import React, { useMemo, useState } from "react";
import { Column, Id, Task } from "@/types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

type Props = {};

const KanbanBoard = ({}: Props) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 111, title: "Test column" },
    {
      id: 222,
      title: "Second column",
    },
  ]);

  //Tasks
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      columnId: 111,
      content: "Task 1",
    },
    {
      id: 2,
      columnId: 222,
      content: "Wassup",
    },
    {
      id: 3,
      columnId: 111,
      content: "Hello",
    },
    {
      id: 4,
      columnId: 222,
      content: "Fourth of July",
    },
  ]);

  //Calculate number of columns
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // Track which column is actively being dragged
  const [activeDragCol, setActiveDragCol] = useState<Column | null>(null);

  //start DRAG event only if user is trying to drag,
  //not jsut cliking on the delete button
  const sensors = useSensors(
    //we are using pointer sensor
    useSensor(PointerSensor, {
      //activated when moved by atleast 3px
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px] ">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div className="m-auto flex gap-4">
          {/* //List of columns */}
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          {/* Add new column button */}
          <button
            className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-slate-800 text-white border-2 border-slate-400 p-4 ring-rose-500 hover:ring-2 flex gap-2"
            onClick={addNewColumn}
          >
            <PlusIcon />
            Add column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeDragCol && (
              <ColumnContainer
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                column={activeDragCol}
                createTask={createTask}
                deleteTask={deleteTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeDragCol.id
                )}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  //Function to add column
  function addNewColumn() {
    //new column
    const newColumn: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, newColumn]);
  }

  //function to delete column
  function deleteColumn(column_id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== column_id);

    setColumns(filteredColumns);
  }

  //update column
  function updateColumn(id: Id, title: string) {
    const updatedColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(updatedColumns);
  }

  //generateID
  function generateId() {
    //Generate random no. between 1-10,000
    return Math.floor(Math.random() * 10001);
  }

  //onDragStart
  function onDragStart(event: DragStartEvent) {
    // console.log("DRAG START:", event);
    //check if dragged type is 'Column'
    //set active column obly then
    if (event.active.data.current?.type === "Column") {
      setActiveDragCol(event.active.data.current.column);
      return;
    }
  }

  //onDragEnd
  function onDragEnd(event: DragEndEvent) {
    // console.log("DRAG END:", event);
    //we get the active and over objects from the event object
    const { active, over } = event;
    //if currently dragged element is not over any other element, we return
    if (!over) return;

    // id of the current dragged element
    const activeColumnId = active.id;
    //id of the element OVER which currently dragged element is hovering
    const overColumnId = over.id;

    //it means currently dragged element is on the same position
    if (activeColumnId === overColumnId) return;

    //update columns by moving places
    setColumns((columns) => {
      //find index of currently dragged element in our STATE columns
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      //find index of currently dragged over element in our STATE columns
      const OverColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      //arrayMove is dnd-kit function which is used to swap places of two elements in an array
      return arrayMove(columns, activeColumnIndex, OverColumnIndex);
    });
  }

  //create new task
  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  //delete task
  function deleteTask(taskId: Id) {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);

    setTasks(updatedTasks);
  }

  //update task
  function updateTask(taskId: Id, newContent: string) {
    const updatedTask = tasks.map((task) => {
      if (task.id !== taskId) return task;
      return { ...task, content: newContent };
    });

    setTasks(updatedTask);
  }
};

export default KanbanBoard;
