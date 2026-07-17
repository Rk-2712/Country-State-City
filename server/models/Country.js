const db = require('../config/db');

class Country {
  static async findAll() {
    const [rows] = await db.pool.query('SELECT * FROM countries ORDER BY name ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.pool.query('SELECT * FROM countries WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async countDocuments() {
    const [rows] = await db.pool.query('SELECT COUNT(*) as count FROM countries');
    return rows[0].count;
  }

  static async insertMany(countries) {
    const results = [];
    for (const country of countries) {
      const res = await this.create(country);
      results.push(res);
    }
    return results;
  }

  static async create({ name, capital, currency, population }) {
    const [result] = await db.pool.query(
      'INSERT INTO countries (name, capital, currency, population) VALUES (?, ?, ?, ?)',
      [name, capital, currency, population]
    );
    return { id: result.insertId, name, capital, currency, population };
  }

  static async update(id, { name, capital, currency, population }) {
    // Dynamically build updating columns to only modify passed values
    const updates = [];
    const values = [];

    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (capital !== undefined) { updates.push('capital = ?'); values.push(capital); }
    if (currency !== undefined) { updates.push('currency = ?'); values.push(currency); }
    if (population !== undefined) { updates.push('population = ?'); values.push(population); }

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    await db.pool.query(
      `UPDATE countries SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await db.pool.query('DELETE FROM countries WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Country;
