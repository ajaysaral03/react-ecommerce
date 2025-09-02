const Home = () => {
  return (
    <div>
            {/* Dashboard Cards */}
        <div className="cards">
          <div className="card purple">
            <h4>Total Sales</h4>
            <p>$12,345</p>
          </div>
          <div className="card red">
            <h4>Pending Orders</h4>
            <p>23</p>
          </div>
          <div className="card yellow">
            <h4>Visitors</h4>
            <p>1,234</p>
          </div>
          <div className="card green">
            <h4>Revenue</h4>
            <p>$7,890</p>
          </div>
        </div>

    </div>
  );
};

export default Home;
