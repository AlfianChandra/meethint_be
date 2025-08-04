import app from "./app.js";
import dotenv from "dotenv";
import { createServerBuilder } from "./builders/serverBuilder.js";
import { createIOModule } from "./modules/io.modules.js";
import { createHandler } from "./modules/service.handler.js";
import { useDbConnection } from "./connection/dbConnection.js";
dotenv.config();

const connection = useDbConnection();
let homeNs = null;
let transcribeNs = null;
let completionNs = null;

const serviceHandler = createHandler();
const ioModule = createIOModule();
const { build, startServer, builderOnce } = createServerBuilder();
builderOnce("system:server-built", async (data) => {
  const status = await startServer(data.server);
  if (status.status === "error") {
    console.error(status.message);
    process.exit(1);
  }

  //Set Socket.IO Instance
  ioModule.setInstance(data.io);

  //Set Namespaces
  homeNs = ioModule.setNamespace("/");
  transcribeNs = ioModule.setNamespace("/transcribe");
  completionNs = ioModule.setNamespace("/completion");

  //Register ns handlers
  serviceHandler.registerTranscribeHandler(data.io, transcribeNs);
  serviceHandler.registerCompletionHandler(data.io, completionNs);
});

builderOnce("system:server-started", ({ port }) => {
  connection.dbConnect(process.env.DB_LOCAL);
});
builderOnce("system:server-error", (error) => {
  console.error(`[SERVER]: ${error}`);
  process.exit(1);
});

(async () => {
  console.clear();
  const buildResult = await build(app);
  if (buildResult.status !== "ok") {
    console.error("[BUILD ERROR]", buildResult.message);
    process.exit(1);
  }
})();
