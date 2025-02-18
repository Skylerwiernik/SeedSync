import "../App.css";
import { app } from "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useState, useEffect} from "react";

const Home = () => {
  const [address, setUserAddress] = useState(""); // React state for address
  const [submittedAddress, setSubmittedAddress] = useState(null); // Stores the submitted address

  const handleSubmit = () => {
    if (address.trim() === "") {
      alert("Please enter an address before submitting.");
      return;
    }

    setSubmittedAddress(address); // Save the submitted address
    console.log("Submitted Address:", address); // Log the address (for debugging)
  };

// imported from firebase
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function signin() {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const user = result.user;
            const userId = user.uid;
      
            if (!await checkUserExists(userId)) {
                let address = await getUserAddress();
                // Store name and address in lowercase for quick case-insensitive queries
                await setDoc(doc(db, "users", userId), {
                    "address": address,
                    "name": user.displayName,
                    "name_lower": user.displayName.toLowerCase(),
                    "address_lower": address.toLowerCase(),
                    "id": userId,
                    "photos": [{}]
                });
            }
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

async function checkUserExists(uid) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    return snap.exists();
}

async function getUserAddress() { // show a pop up when called and return what you get asynchronously 
  if (submittedAddress) {
    console.log("Address is set:", submittedAddress);
    return submittedAddress;
  } else {
    console.log("Address is not set.");
  }
    // return "123 Hawaii Road";
}

useEffect(() => { // make sure an address is submitted
  if (submittedAddress) {
    signin();
  }
}, [submittedAddress]);


  return (
    <div className="App-header" style={{overflow: "hidden"}}>
      <h1>Protect & Preserve Hawaiʻi</h1>
      <p>
        Join our initiative to restore native Hawaiian plant life and control stormwater runoff through rain gardens!
        Learn more about how you can participate and track existing gardens.
      </p>

      <div className="button-container">
        {/* Learn More Button */}
        <a href="https://www.protectpreservehi.org/general-6-1#/ar-gardens" className="btn btn-blue">
          Learn More
        </a>
        <div className="mt-8 flex space-x-4">
          {/* Sign In */}
          <button className="btn btn-blue" onClick={signin}>
            Sign In
          </button>
        </div>
      </div>

      {/* Address Input Field */}
      <div>
        <label htmlFor="user-address" className="block text-sm font-medium text-red-900">
          Enter your address:
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="user-address"
            name="address"
            placeholder="123 Hawaii Road"
            value={address}
            onChange={(e) => setUserAddress(e.target.value)} // Update the address state
            required
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-900 sm:text-sm"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button className="btn btn-blue" onClick={handleSubmit}>
          Submit Address
        </button>
      </div>

      {/* Display Submitted Address */}
      {submittedAddress && (
        <div className="mt-4 text-green-600">
          Address Submitted: {submittedAddress}
        </div>
      )}
    </div>
  );
};

export default Home;