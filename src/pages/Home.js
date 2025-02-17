import "../App.css";
import { app } from "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function signin() {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            const userId = user.uid;
            // Check Firestore collection "admins" for the user
            const adminDocRef = doc(db, "admins", "admins");
            const adminDocSnap = await getDoc(adminDocRef);
            if (adminDocSnap.exists()) {
                const adminData = adminDocSnap.data();

                if (adminData.admins && adminData.admins.includes(userId)) {
                    // User is an admin, redirect to /admin
                    window.location.href = "/admin";
                    return;
                }
            }

            // User is not an admin, redirect to /view/{id}
            window.location.href = `/view/${userId}`;
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
}

const Home = () => {
  return (
    <div className="App-header">
      <h1>Protect & Preserve Hawaiʻi</h1>
      <p>
        Join our initiative to restore native Hawaiian plant life through rain gardens.
        Learn more about how you can participate and track existing gardens.
      </p>
      <a href="https://www.protectpreservehi.org/general-6-1#/ar-gardens" className="App-link">
        Learn More
      </a>
      <div className="mt-8 flex space-x-4">
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" onClick={signin}>
          Existing Gardener Sign In
        </button>
      </div>
    </div>
  );
};

export default Home;
