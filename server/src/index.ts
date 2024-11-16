import { initServer } from "./app";
import { PORT } from "./utils/constants";

async function init() {
  const { app, io, httpserver } = await initServer();

  httpserver.listen(PORT, () => {
    console.log("server is listening on port", PORT, "......");
  });
}

init();
