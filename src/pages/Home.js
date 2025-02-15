import "../App.css"; // Ensure your CSS is imported

const Home = () => {
  return (
    <div className="App-header">
      <h1>Protect & Preserve Hawaiʻi</h1>
      <p>
        Join our initiative to restore native Hawaiian plant life through rain gardens.
        Learn more about how you can participate and track existing gardens.
      </p>
    


        <div className="button-container">
        {/* Learn More Button */}
        <a href="https://www.protectpreservehi.org/general-6-1#/ar-gardens" className="btn btn-blue">
            Learn More
        </a>
        <div className="mt-8 flex space-x-4">
            {/* Sign In */}
            <button className="btn btn-blue">
            Sign In
            </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
