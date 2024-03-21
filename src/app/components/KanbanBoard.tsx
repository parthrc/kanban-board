"use client";
import PlusIcon from "@/icons/PlusIcon";
import React, { useEffect, useMemo, useState } from "react";
import { Column, Id, Task } from "@/types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import ClientPortal from "./ClientPortal";

type Props = {};

const KanbanBoard = ({}: Props) => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 111, title: "Test column 1" },
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
      content: "Task 2",
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

  //Track currently dragged column
  const [activeDragCol, setActiveDragCol] = useState<Column | null>(null);
  //Track current colum OVER which dragged column resides
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

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
        onDragOver={onDragOver}
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
        {/* {createPortal(
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
            {activeDragTask && (
              <TaskCard
                task={activeDragTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          docBody
        )} */}

        {
          <ClientPortal show={true}>
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
              {activeDragTask && (
                <TaskCard
                  task={activeDragTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
            </DragOverlay>
          </ClientPortal>
        }
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
    //Delete all tasks of the column
    const updatedTasks = tasks.filter((task) => task.columnId !== column_id);
    setTasks(updatedTasks);

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
    //set active column only then
    if (event.active.data.current?.type === "Column") {
      setActiveDragCol(event.active.data.current.column);
      return;
    }
    //check if dragged type is 'Task'
    //set active task only then
    if (event.active.data.current?.type === "Task") {
      setActiveDragTask(event.active.data.current.task);
      return;
    }
  }

  //onDragEnd
  //this fires when we drag and leave an element
  // now there are three cases
  //if the dragged element was let go on NO other element
  //if dragged element was let go on the same element
  //if dragged element was let go on another element
  function onDragEnd(event: DragEndEvent) {
    setActiveDragCol(null);
    setActiveDragTask(null);
    // console.log("DRAG END:", event);
    //We get info of the active and over objects from the event
    const { active, over } = event;
    // Case 1: let go, not on any other element
    if (!over) return;

    //ID of the active column
    const activeColumnId = active.id;
    //ID of the over column
    const overColumnId = over.id;

    // Case 2: let go on the same spot
    if (activeColumnId === overColumnId) return;

    // Case 3: let on other spot
    //Swap places in our columns state of the columns
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

  //We use onDragOver when we want drag items which itself are inside a draggable component
  //In this case since Task is inside the draggable Column
  function onDragOver(event: DragOverEvent) {
    // console.log("DRAG END:", event);
    //we get the active and over objects from the event object
    const { active, over } = event;
    //Case 1: if not on any other element
    if (!over) return;

    //Id of active Task
    const activeId = active.id;
    //Id fo active Over
    const overId = over.id;

    //Case 2: let go on same spot
    if (activeId === overId) return;

    //Check if current type is "Task"
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    //Case 3-A: if let go on other task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);
      const overIndex = tasks.findIndex((task) => task.id === overId);

      tasks[activeIndex].columnId = tasks[overIndex].columnId;

      setTasks((tasks) => arrayMove(tasks, activeIndex, overIndex));
    }
    //Case 3-B: if let go on other task on another column
    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((task) => task.id === activeId);

      tasks[activeIndex].columnId = overId;

      setTasks((tasks) => arrayMove(tasks, activeIndex, activeIndex));
    }
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
