const express = require("express");
const { Client } = require("pg");
const createSubscriber = require("pg-listen");

(async function () {
  const server = express();
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log("node.js server listening on port " + port);
  });

  const dbClient = new Client({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: 5432,
  });

  await dbClient.connect();

  const tableName = "table_1";
  const notifyFnName = "number_changed_function";
  const triggerName = "number_changed_trigger";
  const eventName = "number_was_added";

  await dbClient.query(`CREATE TABLE IF NOT EXISTS ${tableName}(
    number INT
    )`);

  await dbClient.query(
    `CREATE OR REPLACE FUNCTION ${notifyFnName}()
            RETURNS TRIGGER
            LANGUAGE PLPGSQL
            AS $$
            DECLARE number text;
            BEGIN
            SELECT to_json(NEW.number)::text INTO number;
            PERFORM pg_notify('${eventName}'::text, number);
            RETURN NULL;
            END;
            $$`
  );

  await dbClient.query(
    `CREATE TRIGGER ${triggerName} AFTER INSERT ON ${tableName}
  FOR EACH ROW EXECUTE FUNCTION ${notifyFnName}()`
  );

  //  Create listener for db
  const subscriber = createSubscriber({
    connectionString: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:5432/${process.env.PGDATABASE}`,
  });
  await subscriber.connect();
  await subscriber.listenTo(eventName);

  subscriber.notifications.on(eventName, async (number) => {
    console.log(`${number} was added to the database`);
  });

  //  Add Item to table
  await dbClient.query(
    `INSERT INTO ${tableName} (number) VALUES (${Math.round(Math.random())})`
  );

})();
