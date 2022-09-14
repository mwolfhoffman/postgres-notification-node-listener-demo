const express = require("express");
const { Pool } = require("pg");

const server = express();
const port = process.env.PORT || 8080;


// const conString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:5432/${process.env.PGDATABASE}`;

// const pool = new Pool({
//   connectionString: conString,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

server.listen(port, () => {
  console.log("node.js server listening on port " + port);
});
//  Create table.

//  Create Trigger and function
//  Create listener for db
//  Run docker logs.
//  Add Item to table
