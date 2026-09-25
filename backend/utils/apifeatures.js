// ==========================================
// API FEATURES UTILITY: SEARCH, FILTER, PAGINATE
// ==========================================
class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  /**
   * Search across product title, category, and description
   */
  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            { title: { $regex: this.queryStr.keyword, $options: "i" } },
            { description: { $regex: this.queryStr.keyword, $options: "i" } },
            { category: { $regex: this.queryStr.keyword, $options: "i" } },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  /**
   * Filter by price ranges, categories, and ratings
   */
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove pagination and search keywords from filter criteria
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Format MongoDB comparison operators (gt, gte, lt, lte, in)
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // Category multi-select filter
    if (this.queryStr.category) {
      this.query = this.query.find({
        category: { $in: this.queryStr.category.split(",") },
      });
    }

    return this;
  }

  /**
   * Paginate query results
   */
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }

  /**
   * Compute pagination metadata
   */
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