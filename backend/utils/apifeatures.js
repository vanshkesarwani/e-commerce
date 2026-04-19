class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    // Search functionality
    search() {
      const keyword = this.queryStr.keyword
        ? {
            $or: [
              { name: { $regex: this.queryStr.keyword, $options: "i" } },
              { description: { $regex: this.queryStr.keyword, $options: "i" } },
              { brand: { $regex: this.queryStr.keyword, $options: "i" } },
            ],
          }
        : {};
  
      this.query = this.query.find({ ...keyword });
      return this;
    }
  
    // Filter functionality
    filter() {
      const queryCopy = { ...this.queryStr };
  
      // Remove fields not needed for filtering
      const removeFields = ["keyword", "page", "limit"];
      removeFields.forEach((key) => delete queryCopy[key]);
  
      // Handle price, rating, and other numeric fields
      let queryStr = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (key) => `$${key}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      // Category filtering
      if (this.queryStr.category) {
        this.query = this.query.find({ category: { $in: this.queryStr.category.split(",") } });
      }
  
      return this;
    }
  
    // Pagination functionality
    pagination(resultPerPage) {
      const currentPage = Number(this.queryStr.page) || 1;
      const skip = resultPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    }
  
    // Return total count and pagination metadata
    async getPaginationMetadata(resultPerPage, totalResults) {
      const totalPages = Math.ceil(totalResults / resultPerPage);
      const currentPage = Number(this.queryStr.page) || 1;
  
      return {
        totalPages,
        currentPage,
        resultPerPage,
        totalResults,
      };
    }
  }
  
  export default ApiFeatures;
  