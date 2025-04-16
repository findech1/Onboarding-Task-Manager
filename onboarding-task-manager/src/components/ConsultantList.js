import React from 'react';

export default function ConsultantList({ consultants }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Consultants</h2>
      <ul className="space-y-1">
        {consultants.map(c => (
          <li key={c.id} className="border p-2 rounded">
            {c.name} - {c.contact} (Last: {c.lastAssigned?.split('T')[0] || 'Never'})
          </li>
        ))}
      </ul>
    </div>
  );
}
