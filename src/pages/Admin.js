import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {doc, getDoc, query, collection, orderBy, limit, startAt, endAt, getFirestore, getDocs} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Import authentication
import "../App.css";
import {app} from "../firebase";

const db = getFirestore(app);
const auth = getAuth(app); // to check if user is admin or not

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // loading 
  const [loading, setLoading] = useState(true); // default loading set to true
  
  // create react states for checking if it IS an admin
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => { // checks if an admin or not and sets react var
    const checkAdminStatus = async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false); // no longer loading
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkAdminStatus(user);
    });

    return () => unsubscribe();
  })

    // calls provided search function whenever input changes
    const handleSearch = async (e) => {
      const value = e.target.value;
      setSearchTerm(value);

      if (!isAdmin) {
        alert("You do not have permission to search."); // alert for non-admins
      }

      if (value.trim() !== "") {
        const data = await queryFirebase(value);
        setResults(data);
      }
      else {
        setResults([]);
      }
    };

  async function queryFirebase(value) {
    value = value.trim().toLowerCase();

    /*
    Firebase does not support a "LIKE" operator,
    so we have to hack around it by sorting and using "startAt" and "endAt".
    We then need to prune for duplicates in the two queries.
     */
    let name_query = query(
        collection(db, "users"),
        orderBy("name_lower"),
        limit(10),
        startAt(value),
        endAt(value + "\uf8ff")
    );

    let address_query = query(
        collection(db, "users"),
        limit(10),
        orderBy("address_lower"),
        startAt(value),
        endAt(value + "\uf8ff")
    );

    let name_results = await getDocs(name_query);
    let address_results = await getDocs(address_query);

    let matches = {};

    // Prune duplicates by ID
    name_results.forEach((item) => {
      matches[item.id] = item.data();
    })
    address_results.forEach((item) => {
      matches[item.id] = item.data();
    })

    return Object.values(matches);
  }

  if (loading) {
    return <p>Loading...</p>; // show loaidng state while chekding admin status
  }

  return (
    <div className="admin-container">
      <h1 className="subtitle">Admin Dashboard</h1>

      {!isAdmin && <p className="error-message">🚫 You do not have permission to search.</p>}

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by name or address..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
          disabled={!isAdmin} // disable input for non-admins
        />
      </div>

      <div className="results-container">
        {results.length > 0 ? (
          results.map((item) => (
            <div 
              key={item.id} 
              className="result-card" 
              onClick={() => navigate(`/view/${item.id}`)}
            >
              <div className="result-content">
                <h3 className="result-name">{item.name}</h3>
                <p className="result-address">{item.address}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
