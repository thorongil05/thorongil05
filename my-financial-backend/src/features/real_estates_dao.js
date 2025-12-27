const pool = require("./database");

async function retrieve() {
  const res = await pool.query("SELECT * FROM real_estates_info");

  return res?.rows.map((value) => {
    return {
      type: value.type,
      address: value.address,
      city: value.city,
      area: value.size_sqm,
      price: value.price,
      referenceDate: value.reference_date,
    };
  });
}

async function insertRealEstateInfo(realEstateEntry) {
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
  insertRealEstateInfo: insertRealEstateInfo,
  retrieve: retrieve,
};
