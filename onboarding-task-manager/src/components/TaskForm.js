import {
  addDoc,
  collection,
  updateDoc,
  doc,
  query,
  getDocs,
  getDoc,
  setDoc,
  orderBy
} from 'firebase/firestore';

const assignTask = async () => {
  if (!task || !date || !facility) return alert("Fill all fields");

  const consultantsSnap = await getDocs(query(collection(db, 'consultants'), orderBy('name')));
  const consultants = consultantsSnap.docs;
  if (consultants.length === 0) return alert("No consultants found");

  // Fetch roundRobin setting
  const roundRobinRef = doc(db, 'settings', 'roundRobin');
  let roundRobinDoc = await getDoc(roundRobinRef);

  if (!roundRobinDoc.exists()) {
    // Initialize if it doesn't exist
    await setDoc(roundRobinRef, { lastAssignedIndex: -1 });
    roundRobinDoc = await getDoc(roundRobinRef);
  }

  const lastIndex = roundRobinDoc.data().lastAssignedIndex || -1;
  const nextIndex = (lastIndex + 1) % consultants.length;
  const selectedConsultant = consultants[nextIndex];
  const consultantData = selectedConsultant.data();

  // Add the task
  await addDoc(collection(db, 'tasks'), {
    task,
    date,
    facility,
    assignedTo: selectedConsultant.id,
    assignedToName: consultantData.name
  });

  // Update consultant's lastAssigned
  await updateDoc(doc(db, 'consultants', selectedConsultant.id), {
    lastAssigned: new Date().toISOString()
  });

  // Update roundRobin lastAssignedIndex
  await updateDoc(roundRobinRef, { lastAssignedIndex: nextIndex });

  // Clear form
  setTask('');
  setDate('');
  setFacility('');
  refreshData();
};
