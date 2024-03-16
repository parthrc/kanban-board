import TrashIcon from "@/icons/TrashIcon";
import { Id, Task } from "@/types";
import { useState } from "react";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (taskId: Id, newContent: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const [taskEditMode, settaskEditMode] = useState(false);
  return (
    <div
      className="bg-slate-900 h-[100px] min-h-[100px] flex text-left items-center rounded-xl p-2.5 hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={() => settaskEditMode(true)}
    >
      {!taskEditMode && (
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap ">
          {task.content}
        </p>
      )}
      {taskEditMode && (
        <textarea
          className="text-white focus:ring focus:ring-rose-500 bg-black p-1 w-full"
          autoFocus
          onBlur={() => settaskEditMode(false)}
          value={task.content}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) settaskEditMode(!taskEditMode);
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      )}
      {mouseIsOver && !taskEditMode && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-slate-600 rounded-full p-1 hover:bg-rose-500"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}

export default TaskCard;
