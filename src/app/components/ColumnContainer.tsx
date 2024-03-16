import PlusIcon from "@/icons/PlusIcon";
import TrashIcon from "@/icons/TrashIcon";
import { Column, Id, Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  tasks?: Task[];
  deleteTask: (taskId: Id) => void;
}

function ColumnContainer(props: Props) {
  const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask } =
    props;

  //Title edit mode
  const [editMode, setEditMode] = useState(false);

  //to make an element draggable
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    //disable dragging if edit is on
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  //change style if dragging
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-slate-800 w-[350px] h-[500px] 
  max-h[500px] rounded-md flex flex-col border-2 border-rose-500 opacity-30"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-800 w-[350px] h-[500px] 
    max-h[500px] rounded-md flex flex-col "
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-slate-900 text-md h-[60px] cursor-grab rounded-xl rounded-b-none p-3 font-bold border-4 border-slate-800 flex items-center justify-between"
      >
        {/* No. of items and title */}
        <div className="flex gap-2 items-center">
          <div className="flex justify-center items-center px-2 py-1 text-sm rounded-full bg-slate-500">
            {tasks?.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              autoFocus
              onBlur={() => setEditMode(false)}
              type="text"
              placeholder={column.title}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
              onChange={(e) => updateColumn(column.id, e.target.value)}
            />
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white hover:bg-red-500 rounded-full p-1"
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </div>
      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-2 overflow-x-auto mx-1">
        {tasks?.map((task) => (
          <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
        ))}
      </div>
      {/* Column footer */}
      <button
        className="flex gap-2 items-center border-2 rounded-md border-slate-600 p-4 hover:text-rose-500 active:bg-black hover:bg-slate-900"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon /> Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
