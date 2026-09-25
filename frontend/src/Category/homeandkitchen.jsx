import React from "react";
import CategoryPageTemplate from "./CategoryPageTemplate";

const HomeKitchen = () => {
  return (
    <CategoryPageTemplate
      categoryKey="Home"
      title="Home & Living"
      subtitle="Modern decor, minimal kitchenware, aesthetic living essentials, and bedding."
      bannerImage="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1600&auto=format&fit=crop"
    />
  );
};

export default HomeKitchen;
