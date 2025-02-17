import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { getAuth } from "firebase/auth";
import "../App.css";

const auth = getAuth(app);
const db = getFirestore(app);

const View = () => {
  const [name, setName] = useState("Loading");
  const [address, setAddress] = useState("Loading");
  const [photos, setPhotos] = useState([]);
  const { id} = useParams();


  useEffect(() => {
    getData();
  }, [photos]);



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

      const photoObj = { photo: url, date: date }
      setPhotos([...photos, photoObj]);
      await updateDoc(userDocRef, {
        photos: arrayUnion(photoObj)
      });
      console.log("Uploaded!");
    } catch (error) {
      console.error("Error uploading file or updating Firestore:", error);
    }

  }

  async function getData() {
    try {
      const ref = doc(db, "users", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        let data = snap.data();
        setPhotos(data["photos"]);
        setName(auth.currentUser.displayName);
        setAddress(data["address"]);

      }
    }
    catch (error) {
      console.error(error);
      window.location = '/';
    }

  }

  return (
    <div className="view-container">
      <h1 className="view-title">{name}</h1>
      <p className="view-address">{address}</p>

      {/* Take New Photo Section */}
      <div className="upload-section">
        <label className="upload-button">
          Take New Photo
          <input type="file" accept="image/*" onChange={triggerUpload} hidden />
        </label>
      </div>


      {/* Past Photos Section */}
      <div className="photos-section">
        <h2>My photos</h2>
        {photos.length > 0 ? (
          photos.map((item, index) => (
            <div key={index} className="photo-card">
              <img src={item.photo} alt={`Taken on ${new Date(item.date).toLocaleDateString()}`} />
              <p className="photo-date">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="no-photos">No photos available.</p>
        )}
      </div>
    </div>
  );
};

export default View;
