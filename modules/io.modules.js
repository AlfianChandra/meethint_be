export const createIOModule = () => {
  let io = null;
  let nsses = {};
  const setInstance = (ioInstance) => {
    io = ioInstance;
    console.log("[IO]: Socket.IO instance set.");
  };
  const setNamespace = (namespace) => {
    try {
      if (io) {
        const ns = io.of(namespace);
        nsses[namespace] = ns;
        console.log(`[IO]: Namespace created: ${namespace}`);
        return ns;
      } else {
        throw new Error("Socket.IO instance not set.");
      }
    } catch (error) {}
  };

  const getNamespace = (namespace) => {
    if (nsses[namespace]) {
      return nsses[namespace];
    }
    throw new Error(`Namespace ${namespace} does not exist.`);
  };

  const getAllNamespaces = () => {
    return nsses;
  };

  return { setInstance, setNamespace, getNamespace, getAllNamespaces };
};
