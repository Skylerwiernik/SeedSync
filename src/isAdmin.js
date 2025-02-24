import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import {app} from "./firebase";
import { getAuth } from "firebase/auth";
const db = getFirestore(app);
const auth = getAuth(app);

export const checkIsAdmin = async () => {
    const adminDocRef = doc(db, "admins", "admins");
    const adminDocSnap = await getDoc(adminDocRef);
    const uid = auth.currentUser.uid;
    if (adminDocSnap.exists()) {
        const adminData = adminDocSnap.data();
        return adminData.admins && adminData.admins.includes(uid);
    }
    return false;
}