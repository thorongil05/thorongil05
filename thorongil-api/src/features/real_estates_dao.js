const pool = require("./database");

async function retrieve(page = 0, size = 10) {
  const offset = page * size;
  const statement =
    "SELECT re.* FROM real_estates_info re ORDER BY re.created_at DESC LIMIT $1 OFFSET $2";
  const values = [size, offset];

  const res = await pool.query(statement, values);

  return res?.rows.map((value) => {
    return {
      id: value.id,
      type: value.type,
      address: value.address,
      location: value.location,
      city: value.city,
      area: value.size_sqm,
      price: value.price,
      referenceDate: value.reference_date,
    };
  });
}

async function insert(realEstateEntry) {
  const query = `
    INSERT INTO real_estates_info
      (type, address, location, city, size_sqm, price, reference_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    realEstateEntry.type,
    realEstateEntry.address,
    realEstateEntry.location,
    realEstateEntry.city,
    realEstateEntry.area,
    realEstateEntry.price,
    realEstateEntry.referenceDate, // deve essere in formato YYYY-MM-DD
  ];

  const { rows } = await pool.query(query, values);
  console.log("Inserted rows: ", rows);
  return rows[0];
}

module.exports = {
  insert: insert,
  retrieve: retrieve,
};
