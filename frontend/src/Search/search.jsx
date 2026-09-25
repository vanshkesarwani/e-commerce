import React from "react";
import SearchResults from "./SearchResults";

// Alias redirect component to ensure any legacy imports cleanly resolve to SearchResults
const Search = () => {
  return <SearchResults />;
};

export default Search;