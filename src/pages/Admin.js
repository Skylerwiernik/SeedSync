import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  query,
  collection,
  orderBy,
  limit,
  startAt,
  endAt,
  getFirestore,
  getDocs,
} from "firebase/firestore";
import {checkIsAdmin} from "../isAdmin";

import "../App.css";
import {app} from "../firebase";

const db = getFirestore(app);

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    checkIsAdmin().then((res) => {
      if (!res) {
        window.location = '/';
      }
    })

   }, []);

    // calls provided search function whenever input changes
    const handleSearch = async (e) => {
      const value = e.target.value;
      setSearchTerm(value);

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

  return (
    <div className="admin-container">
      <h1 className="subtitle">Admin Dashboard</h1>


      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by name or address..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
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
