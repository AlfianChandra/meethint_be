import http from "http";
import dotenv from "dotenv";
import { EventEmitter } from "events";
import { Server } from "socket.io";
dotenv.config();

export const createServerBuilder = () => {
  const emitter = new EventEmitter();

  const build = async (app) => {
    try {
      console.log(
        "===================================================APP RUN==================================================="
      );
      console.log("[SERVER]: TASK STARTED - SERVER BUILDING");
      console.log("[SERVER]: Injecting app into server builder...");
      const server = http.createServer(app);
      console.log("[SERVER]: Creating Socket.IO server...");
      const io = new Server(server, {
        maxHttpBufferSize: 1e8,
        cors: {
          origin: "*", // <-- ganti kalau butuh security lebih ketat
          methods: ["GET", "POST"],
        },
      });

      // Emit setelah objek dibuat
      emitter.emit("system:server-built", { io, server });

      return {
        status: "ok",
        message: "[SERVER]: Server built successfully",
        io,
        server,
      };
    } catch (error) {
      emitter.emit(
        "system:server-error",
        `[SERVER]: Error starting server: ${error}`
      );
      return {
        status: "error",
        message: `[SERVER]: Error building server - ${error.message}`,
      };
    }
  };

  const startServer = async (server) => {
    const port = process.env.PORT || 6625;
    try {
      await new Promise((resolve, reject) => {
        server.once("error", reject); // tangkep kalau misal port udah kepake dll
        server.listen(port, () => {
          console.log(`[SERVER]: Success! Server is running on port: ${port}`);
          console.log(
            `[SERVER]: Socket.IO Path: http://localhost:${port}/socket.io`
          );
          resolve();
        });
      });

      emitter.emit("system:server-started", { port });

      return {
        status: "ok",
        message: `[SERVER]: Server is running on port ${port}`,
      };
    } catch (error) {
      emitter.emit(
        "system:server-error",
        `[SERVER]: Error starting server: ${error}`
      );
      return {
        status: "error",
        message: `[SERVER]: Error starting server - ${error.message}`,
      };
    }
  };

  const builderOn = (event, listener) => emitter.on(event, listener);
  const builderOff = (event, listener) => emitter.off(event, listener);
  const builderOnce = (event, listener) => emitter.once(event, listener);

  return {
    build,
    startServer,
    builderOn,
    builderOff,
    builderOnce,
  };
};
