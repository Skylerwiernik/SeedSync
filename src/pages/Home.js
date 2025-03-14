import "../App.css";
import { app } from "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useState } from "react";

import {Popup } from "../components/Popup";
import { checkIsAdmin } from "../isAdmin";

const Home = () => {
    const [address, setUserAddress] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [uid, setUid] = useState(null);
    const [displayName, setDisplayName] = useState(null);

    const handleSubmit = () => {
        if (address.trim() === "") {
            alert("Please enter an address before submitting.");
            return;
        }
        setDoc(doc(db, "users", uid), {
            "address": address,
            "name": displayName,
            "name_lower": displayName.toLowerCase(),
            "address_lower": address.toLowerCase(),
            "id": uid,
            "photos": []
        }).then(() => redirectUser());
    };

    // imported from firebase
    const auth = getAuth(app);
    const db = getFirestore(app);
    const provider = new GoogleAuthProvider();

    function signin() {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                const userId = result.user.uid;
                setUid(userId);
                setDisplayName(user.displayName);

                if (await checkUserExists(userId)) {
                    await redirectUser(userId);
                }
                else {
                    setShowPopup(true);
                }


            })
            .catch((error) => {
                console.error("Error during sign-in:", error);
            });
    }

    async function redirectUser(uid) {
        if (await checkIsAdmin(uid)) {
            window.location.href = "/admin";
        }
        else {
            window.location.href = `/view/${uid}`;
        }
    }

    async function checkUserExists(uid) {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        return snap.exists();
    }

    return (
        <div className="App-header" style={{overflow: "hidden"}}>
          <div className="view-container">

            {/* Logo */}
            <img className="logo" src="/images/logo.svg" alt="Protect & Preserve Hawaiʻi" />

            <h1 className="title" >Protect & Preserve Hawaiʻi</h1>
            <h2 className="subtitle" >SeedSync 🌱</h2>
            <p className="description" > 
                Join our initiative to restore native Hawaiian plant life and control stormwater runoff through rain
                gardens!
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

            <Popup isVisible={showPopup}>
                <div>
                    <label htmlFor="user-address" className="block text-sm font-medium text-red-900">
                        Please enter the address of your garden
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            id="user-address"
                            name="address"
                            placeholder="123 Hawaii Road, Honolulu HI 96801"
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
                        Continue
                    </button>
                </div>
            </Popup>
            </div>
        </div>
    );
};

export default Home;