import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import petsData from './petsData.json';
import { storage } from "./firebase"; 


import { database, auth } from "./firebase";

export const updatePet = async (id, data) => {
  const petRef = doc(database, 'pets', id);
  await updateDoc(petRef, data);
};

export const deletePet = async (id) => {
  const petRef = doc(database, 'pets', id);
  await deleteDoc(petRef);
};

export const uploadImageAsync = async (uri, path) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, path);
await uploadBytes(storageRef, blob);
console.log("URI enviada para o upload:", uri);
    console.log("Blob criado com sucesso:", blob);

    

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (err) {
    console.error("Erro no uploadImageAsync:", err);
    throw err;
  }
};
export const getPetsByUser = async (uid) => {
  const q = query(collection(database, 'pets'), where('uid', '==', uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export const getPets = async () => {
  await simulateApiDelay();
  return petsData;
};
export const addPet = async (petData) => {
  const petsRef = collection(database, "pets");
  const data = {
    name: petData.name || "Sem nome",
    age: petData.age || "Indefinida",
    location: petData.location || "Não informado",
    image: petData.image || "",
    category: petData.category || "Desconhecida",
    uid: petData.uid || null,
    ownerName: petData.ownerName || "Usuário",
    ownerEmail: petData.ownerEmail || "Sem e-mail",
    ownerPhone: petData.ownerPhone || "", // opcional
  };
  await addDoc(petsRef, data);
};

export const toggleFavorite = async (id) => {
  await simulateApiDelay();
  const petIndex = petsData.findIndex(pet => pet.id === id);
  if (petIndex !== -1) {
    petsData[petIndex].favorited = !petsData[petIndex].favorited;
  }
  return [...petsData]; // Retorna nova referência para atualizar o estado
};

export const createUserProfile = async (user) => {
  const userRef = doc(database, "users", user.uid);
  await setDoc(userRef, {
    name: user.displayName || "",
    email: user.email,
    photoURL: user.photoURL || "",
    phone: "",
  }, { merge: true });
};

export const updateUserProfile = async (uid, data) => {
  const userRef = doc(database, "users", uid);
  await setDoc(userRef, data, { merge: true });
};

export const getUserProfile = async (uid) => {
  const userDoc = await getDoc(doc(database, "users", uid));
  return userDoc.exists() ? userDoc.data() : null;
};
  
export const getCategories = () => {
  return [
    { label: 'Todos', icon: 'paw' },
    { label: 'Cachorro', icon: 'dog' },
    { label: 'Gato', icon: 'cat' },
    { label: 'Peixe', icon: 'fish' },
    { label: 'Pássaro', icon: 'dove' },
  ];
};
