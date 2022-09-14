const express = require("express");
const { Pool } = require("pg");
const createSubscriber = require("pg-listen");

const server = express();
const port = process.env.PORT || 8080;
const conString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:5432/${process.env.PGDATABASE}`;
const pool = new Pool({
  connectionString: conString,
  ssl: {
    rejectUnauthorized: false,
  },
});
server.listen(port, () => {
  console.log("node.js server listening on port " + port);
});

const tableName = "table_1";
const notifyFnName = "number_changed_function";
const triggerName = "number_changed_trigger";
const eventName = "number_was_added";
await pool.query(`CREATE TABLE IF NOT EXISTS ${tableName}(
  number INT 
)`);

await pool.query(
  `CREATE FUNCTION IF NOT EXISTS ${notifyFnName}() 
            RETURNS TRIGGER 
            LANGUAGE PLPGSQL
            AS $$
            DECLARE number text;
            BEGIN
            SELECT to_json(NEW.number)::text INTO number;
            PERFORM pg_notify(${eventName}::text, number);
            RETURN NULL;
            END;
            $$`
);

await pool.query(
  `CREATE TRIGGER  IF NOT EXISTS ${triggerName} AFTER INSERT ON dvs.cloud_hands_on_labs_v0_lab_content
  FOR EACH ROW EXECUTE FUNCTION ${notifyFnName}()`
);

//  Create listener for db
const subscriber = createSubscriber({ connectionString: conString });
await subscriber.connect();
await subscriber.listenTo(eventName);

subscriber.notifications.on(eventName, async (number) => {
  console.log(`${number} was added to the database`);
});

//  Run docker logs.


//  Add Item to table



await pool.query(`DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName}`);
await pool.query(`DROP FUNCTION IF EXISTS ${notifyFnName} ON ${tableName}`);
await pool.query(`DELETE FROM ${tableName}`);
await pool.query(`DROP TABLE FROM ${tableName}`);
