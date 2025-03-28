class MockDatabase {
  constructor() {
    this.data = {
      users: [
        {
          id: 1,
          username: "john@example.com",
          password: "hashedPassword123",
          role: "user",
        },
      ],
      sales: [
        { id: 1, product: "Widget", amount: 100, date: "2024-01-01" },
        { id: 2, product: "Gadget", amount: 200, date: "2024-01-02" },
        { id: 3, product: "Device", amount: 150, date: "2024-01-03" },
      ],
      customers: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "Bob Wilson", email: "bob@example.com" },
      ],
    };
  }

  // Existing user methods
  async createUser(username, hashedPassword) {
    const newUser = {
      id: this.data.users.length + 1,
      username,
      password: hashedPassword,
      role: "user",
    };

    const existingUser = this.data.users.find((u) => u.username === username);
    if (existingUser) {
      throw new Error("User already exists");
    }

    this.data.users.push(newUser);
    return { id: newUser.id, username: newUser.username, role: newUser.role };
  }

  async findUserByUsername(username) {
    return this.data.users.find((u) => u.username === username);
  }

  // Add the missing executeQuery method
  async executeQuery(sqlQuery) {
    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const query = sqlQuery.toLowerCase();

    // Handle COUNT queries
    if (query.includes("count(*)")) {
      if (query.includes("from sales")) {
        return [{ count: this.data.sales.length }];
      } else if (query.includes("from customers")) {
        return [{ count: this.data.customers.length }];
      }
    }

    // Handle AVG queries
    if (query.includes("avg(amount)")) {
      const total = this.data.sales.reduce((sum, sale) => sum + sale.amount, 0);
      return [{ average: total / this.data.sales.length }];
    }

    // Handle SUM queries
    if (query.includes("sum(amount)")) {
      const total = this.data.sales.reduce((sum, sale) => sum + sale.amount, 0);
      return [{ total }];
    }

    // Handle basic SELECT queries
    if (query.includes("from sales")) {
      return this.data.sales;
    } else if (query.includes("from customers")) {
      return this.data.customers;
    }

    return [];
  }
}

module.exports = new MockDatabase();
