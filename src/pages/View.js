import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {checkIsAdmin} from "../isAdmin";

import "../App.css";

const auth = getAuth(app);
const db = getFirestore(app);

const View = () => {
  const [name, setName] = useState("Loading");
  const [address, setAddress] = useState("Loading");
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // track clicked photo to show

  const { id} = useParams();

  useEffect(() => {
    onAuthStateChanged(auth, () => {
      getData();
    });

  }, [auth]);

  const triggerUpload = (event) => {
    uploadPhoto(event.target.files[0]);
  };

  async function uploadPhoto(file) {

    const storage = getStorage();
    const filePath = `users/${id}/${file.name}`;
    const storageRef = ref(storage, filePath);

    const date = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });

    try {
      // Upload the file
      await uploadBytes(storageRef, file);
      console.log("File uploaded successfully.");

      // Get the public URL of the uploaded file
      const url = await getDownloadURL(storageRef);
      console.log("File URL:", url);

      // Update the Firestore document with the new photo
      const db = getFirestore();
      const userDocRef = doc(db, "users", id);

      const photoObj = { photo: url, date: date }; // create new photo obj

      // Sort by date in descending order
      const updatedPhotos = [...photos, photoObj].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setPhotos(updatedPhotos);
      await updateDoc(userDocRef, {
        photos: arrayUnion(photoObj)
      });
      console.log("Uploaded and sorted!");
    } catch (error) {
      console.error("Error uploading file or updating Firestore:", error);
    }

  }

  async function getData() {

    if (auth.currentUser.uid !== id) {
      checkIsAdmin().then((res) => {
        if (!res) {
          window.location.href = "/";
        }
      })
    }

    try {
      const ref = doc(db, "users", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        let data = snap.data();

        // sort array of photos so most recent appears first
        const sortedPhotos = data["photos"]
        // check if there are any photos, if data["photos"] exists = create a copy of it
          ? [...data["photos"]].sort(
              (a, b) => new Date(b.date) - new Date(a.date)// sort the photos by date

            )
          : [];  // no photos = use an empty array 

        // setPhotos(data["photos"]);
        setPhotos(sortedPhotos);
        setName(auth.currentUser.displayName);
        setAddress(data["address"]);
      }
    }
    catch (error) {
      console.error(error);
      window.location = '/'; // redirect
    }
  }

  return (
    <div className="App-header" style={{overflow: "hidden"}}>
      <div className="view-container">
        <h1 className="subtitle">{name}</h1>
        <p className="view-address">{address}</p>

        {/* Take New Photo Section */}
        <div className="upload-section">

        {/* upload button */}
        <div className="mt-8 flex space-x-4">
          <label className="btn btn-blue">
              Take New Photo
              <input type="file" accept="image/*" onChange={triggerUpload} hidden />
            </label>
          </div>
        </div>

        {/* 📷 Photo Gallery */}
        <div className="photo-gallery">
          <h2>My Photos 📷</h2>
          {photos.length > 0 && photos[0].photo ? (
            <div className="gallery">
            {photos.map((item, index) => (
              <div key={index} className="gallery-item">
                <img
                  src={item.photo}
                  alt={`Taken on ${item.date}`}
                  className="gallery-photo"
                  onClick={() => setSelectedPhoto(item)} // click to enlarge
                />
                <p className="photo-date">{item.date}</p> {/* show the date under  image */}
              </div>
            ))}
          </div>          
          ) : (
            <p className="no-photos">No photos available.</p>
          )}
        </div>
      </div>

      {/* Modal for Enlarged Photo when hovering */}
      {selectedPhoto && (
        <div className="modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content">
            <img src={selectedPhoto.photo} alt="Enlarged view" className="modal-image" />
             <p className="modal-date">{selectedPhoto.date}</p> {/* show the date under image */}
          </div>
        </div>
      )}
    </div>
  );
};

export default View;
