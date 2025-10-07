import { Query } from "mongoose";

/**
 * ApiFeatures Utility Class
 * Provides pagination, filtering, and sorting for MongoDB queries.
 */
class ApiFeatures<T> {
  query: Query<T[], T>;
  queryString: Record<string, any>;

  constructor(query: Query<T[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
  }

  //   Basic filtering based on query parameters

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields", "keyword"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // Convert to string for advanced filtering (gt, lt, gte, lte)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|regex)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  // Keyword search for title/author/genre

  search() {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      this.query = this.query.find({
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { author: { $regex: keyword, $options: "i" } },
          { genre: { $regex: keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  //   Example: /books?sort=title,-copies
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default sort (by creation date)
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  //     Field Limiting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  //   Pagination
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
