const db = require('../config/db');

class State {
  static async findAll() {
    const [rows] = await db.pool.query(`
      SELECT s.*, 
             c.id as \`country._id\`, c.id as \`country.id\`, c.name as \`country.name\`, 
             c.capital as \`country.capital\`, c.currency as \`country.currency\`, c.population as \`country.population\`
      FROM states s
      JOIN countries c ON s.country_id = c.id
      ORDER BY s.name ASC
    `);

    return rows.map(row => ({
      id: row.id,
      _id: row.id,
      name: row.name,
      capital: row.capital,
      country: {
        id: row['country.id'],
        _id: row['country._id'],
        name: row['country.name'],
        capital: row['country.capital'],
        currency: row['country.currency'],
        population: row['country.population']
      },
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    }));
  }

  static async findByCountryId(countryId) {
    const [rows] = await db.pool.query(
      'SELECT * FROM states WHERE country_id = ? ORDER BY name ASC',
      [countryId]
    );
    return rows;
  }

  static async create({ name, country, capital }) {
    // If client passes country as an object or just ID
    const countryId = typeof country === 'object' ? country.id || country._id : country;
    const [result] = await db.pool.query(
      'INSERT INTO states (name, country_id, capital) VALUES (?, ?, ?)',
      [name, countryId, capital || null]
    );
    return { id: result.insertId, name, country: countryId, capital };
  }

  static async update(id, { name, country, capital }) {
    const countryId = typeof country === 'object' ? country.id || country._id : country;
    const [result] = await db.pool.query(
      'UPDATE states SET name = ?, country_id = ?, capital = ? WHERE id = ?',
      [name, countryId, capital || null, id]
    );
    if (result.affectedRows === 0) return null;
    return { id: parseInt(id), name, country: countryId, capital };
  }

  static async delete(id) {
    const [result] = await db.pool.query('DELETE FROM states WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = State;
