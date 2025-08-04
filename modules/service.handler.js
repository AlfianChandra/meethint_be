export const createHandler = () => {
  const registerTranscribeHandler = (io, ns) => {
    console.log(`[TRANSCRIBE]: Handler registered for namespace: ${ns.name}`);
    ns.on("connection", (socket) => {
      console.log(
        `[TRANSCRIBE]: A Client has connected to TRANSCRIBE Channel: ${socket.id}`
      );

      socket.on("disconnect", () => {
        console.log(
          `[TRANSCRIBE]: Client has disconnected from TRANSCRIBE Channel: ${socket.id}`
        );
      });
    });
  };

  const registerCompletionHandler = (io, ns) => {
    console.log(`[COMPLETION]: Handler registered for namespace: ${ns.name}`);
    ns.on("connection", (socket) => {
      console.log(
        `[COMPLETION]: A Client has connected to COMPLETION Channel: ${socket.id}`
      );

      socket.on("disconnect", () => {
        console.log(
          `[COMPLETION]: Client has disconnected from COMPLETION Channel: ${socket.id}`
        );
      });
    });
  };

  return {
    registerTranscribeHandler,
    registerCompletionHandler,
  };
};
