import "../App.css"; // Ensure your CSS is imported

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
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Existing Gardener Sign In
        </button>
        <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Admin Sign In
        </button>
      </div>
    </div>
  );
};

export default Home;
