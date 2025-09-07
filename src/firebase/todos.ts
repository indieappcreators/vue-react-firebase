import { firestore } from './app';
import { doc, collection, addDoc, deleteDoc, getDoc, where, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import getData from './utils/parseDocs';

const todos = collection(firestore, "todos");

// Creates a new todo and returns the id
export const createTodo = async (newTodo: { text: string; completed: boolean; owner: string }) => 
  (await addDoc(todos, { ...newTodo, createdAt: new Date() })).id;

// Fetches a todo by id
export const fetchTodo = async (id: string) => {
  try {
    const todoRef = doc(todos, id);
    const docSnap = await getDoc(todoRef);
    if (!docSnap.exists()) {
      throw new Error("Todo does not exist");
    }
    return docSnap.data();
  } catch (error) {
    throw new Error(error as string);
  }  
} 

// Deletes a todo by id
export const deleteTodo = (id: string) => deleteDoc(doc(todos, id));

// Fetches all todos for a user
export const fetchAllTodos = async (uid: string) => {
  try {
    const todosQuery = query(todos, where("owner", "==", uid), orderBy("createdAt", "desc"));
    const todosSnapShot = await getDocs(todosQuery);
    return getData(todosSnapShot.docs);
  } catch (error) {
    throw new Error(error as string);
  }
}

// Updates a todo by id
export const updateTodo = async (id: string, updates: Partial<{ text: string; completed: boolean }>) => {
  try {
    const todoRef = doc(todos, id);
    await updateDoc(todoRef, updates);
    // Note: updateDoc would be better here, but keeping with the pattern
    return todoRef;
  } catch (error) {
    throw new Error(error as string);
  }
}
