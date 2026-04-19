import React, { useState, useEffect } from "react";
import MetaData from "../layout/MetaData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../Product/ProductCard"; // Assuming you have a ProductCard component

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (keyword.trim()) {
      fetchProducts(keyword);
    }
  }, [keyword]);

  const fetchProducts = async (searchKeyword) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:3900/api/products/search/${searchKeyword}`
      );
      setProducts(data.products);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?query=${keyword}`);
    }
  };

  return (
    <div>
      <MetaData title="Search A Product -- ECOMMERCE" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full py-2 px-4 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Search
        </button>
      </form>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-list">
          {products.length ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div>No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;