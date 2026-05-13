import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { routes } from "./routes/route";

const server: Server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    
    try {

      routes(req, res);

    } catch (error) {
      res.setHeader("Content-Type", "application/json");

      return res.end(
        JSON.stringify({
          success: false,
          message: "500 Internal Server Error",
        }),
      );
    }
  },
);

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
