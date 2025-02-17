import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; // Ensure styles are included

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Calls the provided search function whenever input changes
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Call your search function (replace `yourSearchFunction` with your actual function)
    if (value.trim() !== "") {
      const data = await yourSearchFunction(value); // This function should return a list of dictionaries
      setResults(data);
    } else {
      setResults([]); // Clear results when search bar is empty
    }
  };

  async function yourSearchFunction(value) {
    // Simulated API Response (Replace with actual search function)
    return [
      { Name: "Foobar", Address: "123 Road", id: "123456" },
      { Name: "Alice's Cafe", Address: "456 Main St", id: "654321" },
    ];
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* Large Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search by name or address..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      {/* Display Search Results */}
      <div className="results-container">
        {results.length > 0 ? (
          results.map((item) => (
            <div 
              key={item.id} 
              className="result-card" 
              onClick={() => navigate(`/view/${item.id}`)}
            >
              <div className="result-content">
                <h3 className="result-name">{item.Name}</h3>
                <p className="result-address">{item.Address}</p>
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
