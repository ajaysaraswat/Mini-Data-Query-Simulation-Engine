const queryService = require("../services/queryService");

class QueryController {
  async processQuery(req, res) {
    try {
      const { query } = req.body;
      const result = await queryService.processNaturalLanguageQuery(query);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async explainQuery(req, res) {
    try {
      const { query } = req.body;
      const explanation = await queryService.explainQuery(query);
      res.json(explanation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async validateQuery(req, res) {
    try {
      const { query } = req.body;
      const validation = await queryService.validateQuery(query);
      res.json(validation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new QueryController();
