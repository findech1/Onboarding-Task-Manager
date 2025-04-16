import React from 'react';

export default function TaskList({ tasks }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Task Assignments</h2>
      <ul className="space-y-1">
        {tasks.map((t, i) => (
          <li key={i} className="border p-2 rounded">
            {t.date}: {t.task} at {t.facility} (Assigned to: {t.assignedToName})
          </li>
        ))}
      </ul>
    </div>
  );
}
