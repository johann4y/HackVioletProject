import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Create a new pin
export const createPin = async (pinData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const pin = {
    ...pinData,
    location: new GeoPoint(pinData.lat, pinData.lng),
    userId: user.email, // Use Google email as userId
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "pins"), pin);
  return docRef.id;
};

// Get all pins
export const getAllPins = async () => {
  const querySnapshot = await getDocs(collection(db, "pins"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    lat: doc.data().location.latitude,
    lng: doc.data().location.longitude,
  }));
};

// Update a pin (only by the user who created it)
export const updatePin = async (pinId, updatedData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const pinRef = doc(db, "pins", pinId);
  const pinSnap = await getDoc(pinRef);

  if (pinSnap.exists() && pinSnap.data().userId === user.email) {
    await updateDoc(pinRef, updatedData);
  } else {
    throw new Error("Unauthorized: You can only update your own pins");
  }
};

// Delete a pin (only by the user who created it)
export const deletePin = async (pinId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const pinRef = doc(db, "pins", pinId);
  const pinSnap = await getDoc(pinRef);

  if (pinSnap.exists() && pinSnap.data().userId === user.email) {
    await deleteDoc(pinRef);
  } else {
    throw new Error("Unauthorized: You can only delete your own pins");
  }
};