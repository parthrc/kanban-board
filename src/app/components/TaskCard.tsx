import TrashIcon from "@/icons/TrashIcon";
import { Id, Task } from "@/types";
import { useState } from "react";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
}

function TaskCard({ task, deleteTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  return (
    <div
      className="bg-slate-900 h-[100px] min-h[100px] flex text-left items-center rounded-xl p-2.5 hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      {task.content}
      {mouseIsOver && (
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
