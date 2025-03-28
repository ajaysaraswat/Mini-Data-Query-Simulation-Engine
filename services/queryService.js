const QueryTranslator = require("../utils/queryTranslator");
const mockDb = require("../database/mockDb");

class QueryService {
  async processNaturalLanguageQuery(query) {
    const sqlQuery = QueryTranslator.toSQL(query);
    const result = await mockDb.executeQuery(sqlQuery);
    return {
      naturalQuery: query,
      sqlQuery: sqlQuery,
      result: result,
    };
  }

  async explainQuery(query) {
    const sqlQuery = QueryTranslator.toSQL(query);
    return {
      steps: [
        { step: 1, description: "Natural language parsing" },
        { step: 2, description: "Entity recognition" },
        { step: 3, description: "SQL translation" },
        { step: 4, description: "Query optimization" },
      ],
      originalQuery: query,
      translatedSQL: sqlQuery,
    };
  }

  async validateQuery(query) {
    const isValid = QueryTranslator.validate(query);
    return {
      isValid,
      feedback: isValid
        ? "Query is valid"
        : "Query contains unsupported operations",
    };
  }
}

module.exports = new QueryService();
