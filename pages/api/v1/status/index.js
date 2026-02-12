import database from "infra/database.js";
import { version } from "react";

async function status(request, response) {
  const updateAl = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectResult = await database.query("SHOW max_connections;");
  const databaseMaxConnectValue = await databaseMaxConnectResult.rows[0].max_connections;


  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionValue = 
    await databaseOpenedConnectionResult.rows[0].count;

  response.status(200).json({
    updated_at: updateAl,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectValue),
        opened_connections: databaseOpenedConnectionValue,
      },
    },
  });
}

export default status;