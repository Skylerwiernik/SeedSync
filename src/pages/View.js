import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";


const View = () => {
  const [name, setName] = useState("Loading...");
  const [address, setAddress] = useState("Loading...");
  const [photos, setPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPhotos();
        setPhotos(data || []); // If data is undefined, default to an empty array
      } catch (error) {
        console.error("Error fetching photos:", error);
        setPhotos([]); // Prevent crashes
      }
    };
  
    fetchPhotos();
  }, []);
  

  // Handle file selection
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewPhoto(URL.createObjectURL(file)); // Show preview of uploaded photo
    }
  };

  async function getPhotos() { // replace

  }

  return (
    <div className="view-container">
      <h1 className="view-title">{name}</h1>
      <p className="view-address">{address}</p>

      {/* Take New Photo Section */}
      <div className="upload-section">
        <label className="upload-button">
          Take New Photo
          <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
        </label>
      </div>

      {/* Display Uploaded Photo (Preview) */}
      {newPhoto && (
        <div className="uploaded-photo">
          <h3>New Photo Preview</h3>
          <img src={newPhoto} alt="New upload preview" />
        </div>
      )}

      {/* Past Photos Section */}
      <div className="photos-section">
        <h2>Past Photos</h2>
        {photos.length > 0 ? (
          photos.map((item, index) => (
            <div key={index} className="photo-card">
              <img src={item.photo} alt={`Taken on ${new Date(item.date).toLocaleDateString()}`} />
              <p className="photo-date">{new Date(item.date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p className="no-photos">No past photos available.</p>
        )}
      </div>
    </div>
  );
};

export default View;
