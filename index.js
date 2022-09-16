const express = require("express");
const { Client } = require("pg");
const createSubscriber = require("pg-listen");

(async function () {
  const server = express();
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log("node.js server listening on port " + port);
  });

  console.log(1);
  const dbClient = new Client({
    host: "postgres",
    user: "pguser",
    password: "password",
    database: "pg-notify-db",
    port: "5432",
  });

  await dbClient.connect();

  // const tableName = "table_1";
  // const notifyFnName = "number_changed_function";
  // const triggerName = "number_changed_trigger";
  // const eventName = "number_was_added";

  // await dbClient.query(`CREATE TABLE IF NOT EXISTS ${tableName}(
  //   number INT
  //   )`);

  console.log(2);

  // await dbClient.query(
  //   `CREATE FUNCTION IF NOT EXISTS ${notifyFnName}()
  //           RETURNS TRIGGER
  //           LANGUAGE PLPGSQL
  //           AS $$
  //           DECLARE number text;
  //           BEGIN
  //           SELECT to_json(NEW.number)::text INTO number;
  //           PERFORM pg_notify(${eventName}::text, number);
  //           RETURN NULL;
  //           END;
  //           $$`
  // );

  // await dbClient.query(
  //   `CREATE TRIGGER  IF NOT EXISTS ${triggerName} AFTER INSERT ON dvs.cloud_hands_on_labs_v0_lab_content
  // FOR EACH ROW EXECUTE FUNCTION ${notifyFnName}()`
  // );

  // // //  Create listener for db
  // // const subscriber = createSubscriber({ connectionString: conString });
  // // await subscriber.connect();
  // // await subscriber.listenTo(eventName);

  // // subscriber.notifications.on(eventName, async (number) => {
  // //   console.log(`${number} was added to the database`);
  // // });

  // // //  Add Item to table
  // // setInterval(async () => {
  // //   await dbClient.query(`INSERT INTO ${tableName} (${Math.random()})  `);
  // // }, 500);

  // // //  Clean Up
  // // setTimeout(async () => {
  // //   await dbClient.query(`DROP TRIGGER IF EXISTS ${triggerName} ON ${tableName}`);
  // //   await dbClient.query(`DROP FUNCTION IF EXISTS ${notifyFnName} ON ${tableName}`);
  // //   await dbClient.query(`DELETE FROM ${tableName}`);
  // //   await dbClient.query(`DROP TABLE FROM ${tableName}`);
  // //   process.exit();
  // // }, 10000);
})();
