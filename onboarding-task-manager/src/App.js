import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy
} from 'firebase/firestore';

export default function OnboardingTaskManager() {
  const [consultants, setConsultants] = useState([]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [facility, setFacility] = useState('');
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const taskOptions = [
    'Onboarding',
    'Stock Update',
    'Refresher Training',
    'Troubleshooting',
    'Reactivation'
  ];

  const fetchConsultants = async () => {
    const q = query(collection(db, 'consultants'), orderBy('lastAssigned'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setConsultants(data);
  };

  const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, 'tasks'));
    const data = snapshot.docs.map(doc => doc.data());
    setTasks(data);
  };

  useEffect(() => {
    fetchConsultants();
    fetchTasks();
  }, []);

  const assignTask = async () => {
    if (!task || !date || !facility || consultants.length === 0) return;

    const nextConsultant = consultants[0];

    await addDoc(collection(db, 'tasks'), {
      task,
      date,
      facility,
      assignedTo: nextConsultant.id,
      assignedToName: nextConsultant.name
    });

    await updateDoc(doc(db, 'consultants', nextConsultant.id), {
      lastAssigned: new Date()
    });

    setTask('');
    setDate('');
    setFacility('');
    fetchConsultants();
    fetchTasks();
  };

  const registerConsultant = async () => {
    const name = prompt("Enter consultant name");
    const contact = prompt("Enter consultant contact");
    if (!name || !contact) return;

    await addDoc(collection(db, 'consultants'), {
      name,
      contact,
      lastAssigned: new Date(0) // set to oldest date
    });

    fetchConsultants();
  };

  const filteredTasks = tasks.filter(t =>
    t.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.assignedToName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Onboarding Task Manager</h1>

        <div className="grid gap-4 mb-6">
          <select
            value={task}
            onChange={e => setTask(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Task</option>
            {taskOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Facility Name"
            value={facility}
            onChange={e => setFacility(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <div className="flex gap-2">
            <button onClick={assignTask} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Assign Task</button>
            <button onClick={registerConsultant} className="flex-1 bg-white border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50">Add Consultant</button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Consultants</h2>
          <ul className="space-y-2">
            {consultants.map(c => {
              const lastAssignedDate = c.lastAssigned?.toDate?.()?.toISOString()?.split('T')[0] || 'Never';
              return (
                <li key={c.id} className="p-3 bg-gray-100 rounded border border-gray-300">
                  <span className="font-medium">{c.name}</span> - {c.contact || 'No contact'}
                  <div className="text-sm text-gray-600">Last Assigned: {lastAssignedDate}</div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search tasks by name, facility, or consultant..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Tasks</h2>
          <ul className="space-y-2">
            {filteredTasks.map((t, i) => (
              <li key={i} className="p-3 bg-gray-50 rounded border border-gray-300">
                <div className="text-gray-800 font-medium">{t.date}: {t.task}</div>
                <div className="text-sm text-gray-600">Facility: {t.facility} | Assigned to: {t.assignedToName}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
