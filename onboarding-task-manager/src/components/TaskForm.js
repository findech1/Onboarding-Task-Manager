import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, updateDoc, doc, query, orderBy, getDocs } from 'firebase/firestore';

export default function TaskForm({ refreshData }) {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [facility, setFacility] = useState('');

  const assignTask = async () => {
    if (!task || !date || !facility) return alert("Fill all fields");

    const consultantsQuery = query(collection(db, 'consultants'), orderBy('lastAssigned'));
    const consultantsSnap = await getDocs(consultantsQuery);
    if (consultantsSnap.empty) return alert("No consultants found");

    const consultant = consultantsSnap.docs[0];
    const consultantData = consultant.data();

    await addDoc(collection(db, 'tasks'), {
      task,
      date,
      facility,
      assignedTo: consultant.id,
      assignedToName: consultantData.name
    });

    await updateDoc(doc(db, 'consultants', consultant.id), {
      lastAssigned: new Date().toISOString()
    });

    setTask('');
    setDate('');
    setFacility('');
    refreshData();
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Assign Task</h2>
      <input type="text" placeholder="Task" value={task} onChange={e => setTask(e.target.value)} className="w-full p-2 border rounded mb-2" />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded mb-2" />
      <input type="text" placeholder="Facility Name" value={facility} onChange={e => setFacility(e.target.value)} className="w-full p-2 border rounded mb-2" />
      <button onClick={assignTask} className="bg-blue-600 text-white px-4 py-2 rounded">Assign</button>
    </div>
  );
}
