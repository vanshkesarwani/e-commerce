import React, { useState, useEffect } from 'react';
import HomeBanner from '../BannerHome/HomeBanner';
import GetAllProducts from '../Product/GetAllProducts';
import Loader from "../components/Loader";  // Import the loader

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div>
      {loading ? (
        <Loader />  // Show the loader while loading
      ) : (
        <div>
          <HomeBanner />
          <GetAllProducts />
        </div>
      )}
    </div>
  );
};

export default Home;