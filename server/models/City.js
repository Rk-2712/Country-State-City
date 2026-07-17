const db = require('../config/db');

class City {
  static async findAll() {
    const [rows] = await db.pool.query(`
      SELECT c.id as cityId, c.name as cityName, c.createdAt as cityCreatedAt, c.updatedAt as cityUpdatedAt,
             s.id as stateId, s.name as stateName,
             co.id as countryId, co.name as countryName, co.capital as countryCapital, 
             co.currency as countryCurrency, co.population as countryPopulation
      FROM cities c
      JOIN states s ON c.state_id = s.id
      JOIN countries co ON s.country_id = co.id
      ORDER BY c.name ASC
    `);

    return rows.map(row => ({
      id: row.cityId,
      _id: row.cityId,
      name: row.cityName,
      state: {
        id: row.stateId,
        _id: row.stateId,
        name: row.stateName,
        country: {
          id: row.countryId,
          _id: row.countryId,
          name: row.countryName,
          capital: row.countryCapital,
          currency: row.countryCurrency,
          population: row.countryPopulation
        }
      },
      createdAt: row.cityCreatedAt,
      updatedAt: row.cityUpdatedAt
    }));
  }

  static async findByStateId(stateId) {
    const [rows] = await db.pool.query(
      'SELECT * FROM cities WHERE state_id = ? ORDER BY name ASC',
      [stateId]
    );
    return rows;
  }

  static async create({ name, state }) {
    const stateId = typeof state === 'object' ? state.id || state._id : state;
    const [result] = await db.pool.query(
      'INSERT INTO cities (name, state_id) VALUES (?, ?)',
      [name, stateId]
    );
    return { id: result.insertId, name, state: stateId };
  }

  static async delete(id) {
    const [result] = await db.pool.query('DELETE FROM cities WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = City;
