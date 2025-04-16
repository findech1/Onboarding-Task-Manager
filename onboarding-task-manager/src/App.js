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
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import './style.css';

export default function OnboardingTaskManager() {
  const [consultants, setConsultants] = useState([]);
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [facility, setFacility] = useState('');
  const [tasks, setTasks] = useState([]);

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
      lastAssigned: new Date().toISOString()
    });

    setTask('');
    setDate('');
    setFacility('');
    fetchConsultants();
    fetchTasks();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Onboarding Task Manager</h1>
      <Card className="mb-4">
        <CardContent className="space-y-2">
          <input
            type="text"
            placeholder="Task"
            value={task}
            onChange={e => setTask(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Facility Name"
            value={facility}
            onChange={e => setFacility(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <Button onClick={assignTask}>Assign Task</Button>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-2">Consultants</h2>
      <ul className="mb-6">
        {consultants.map(c => (
          <li key={c.id} className="border p-2 rounded mb-1">
            {c.name} - {c.contact} (Last: {c.lastAssigned?.split('T')[0] || 'Never'})
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Tasks</h2>
      <ul>
        {tasks.map((t, i) => (
          <li key={i} className="border p-2 rounded mb-1">
            {t.date}: {t.task} at {t.facility} (Assigned to: {t.assignedToName})
          </li>
        ))}
      </ul>
    </div>
  );
}
