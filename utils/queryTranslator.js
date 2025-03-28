class QueryTranslator {
  // Common patterns for natural language queries
  static patterns = {
    show: /^show\s+me\s+/i,
    get: /^get\s+/i,
    find: /^find\s+/i,
    list: /^list\s+/i,
    what: /^what\s+/i,
    how: /^how\s+/i,
    count: /count|number\s+of/i,
    average: /average|avg|mean/i,
    sum: /sum|total/i,
    sales: /sales|revenue|transactions/i,
    customers: /customers|clients|users/i,
    products: /products|items|goods/i,
  };

  static keywords = {
    aggregates: ["count", "sum", "average", "min", "max"],
    tables: ["sales", "customers", "products"],
    conditions: ["where", "greater than", "less than", "equal to", "between"],
    timeframes: ["today", "yesterday", "this week", "this month", "this year"],
  };

  /**
   * Converts natural language query to SQL
   */
  static toSQL(naturalQuery) {
    const query = naturalQuery.toLowerCase().trim();

    // Handle count queries
    if (this.patterns.count.test(query)) {
      return this.handleCountQuery(query);
    }

    // Handle aggregate queries
    if (this.patterns.average.test(query)) {
      return this.handleAggregateQuery(query, "AVG");
    }

    if (this.patterns.sum.test(query)) {
      return this.handleAggregateQuery(query, "SUM");
    }

    // Handle basic select queries
    return this.handleBasicQuery(query);
  }

  /**
   * Handles count-type queries
   */
  static handleCountQuery(query) {
    let table = "sales"; // default table

    if (this.patterns.customers.test(query)) {
      table = "customers";
    } else if (this.patterns.products.test(query)) {
      table = "products";
    }

    return `SELECT COUNT(*) as count FROM ${table}`;
  }

  /**
   * Handles aggregate queries (sum, average, etc.)
   */
  static handleAggregateQuery(query, aggregateType) {
    let column = "amount";
    let table = "sales";

    return `SELECT ${aggregateType}(${column}) as ${aggregateType.toLowerCase()} FROM ${table}`;
  }

  /**
   * Handles basic select queries
   */
  static handleBasicQuery(query) {
    let table = "sales";
    let columns = "*";

    if (this.patterns.customers.test(query)) {
      table = "customers";
    } else if (this.patterns.products.test(query)) {
      table = "products";
    }

    return `SELECT ${columns} FROM ${table}`;
  }

  /**
   * Validates if the query can be processed
   */
  static validate(query) {
    if (!query || typeof query !== "string") {
      return false;
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Check if query contains at least one known pattern
    const hasKnownPattern = Object.values(this.patterns).some((pattern) =>
      pattern.test(normalizedQuery)
    );

    // Check if query contains at least one known table reference
    const hasKnownTable = this.keywords.tables.some((table) =>
      normalizedQuery.includes(table)
    );

    // Check for minimum query length
    const hasMinLength = normalizedQuery.length >= 3;

    // Check for unsupported or complex operations
    const hasUnsupportedOperations =
      normalizedQuery.includes("join") ||
      normalizedQuery.includes("union") ||
      normalizedQuery.includes("delete") ||
      normalizedQuery.includes("update") ||
      normalizedQuery.includes("insert");

    return (
      hasKnownPattern &&
      hasKnownTable &&
      hasMinLength &&
      !hasUnsupportedOperations
    );
  }
}

module.exports = QueryTranslator;
