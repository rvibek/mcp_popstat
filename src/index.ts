import { MCPServer } from "mcp-framework";

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 1337;

const server = new MCPServer({
  transport: {
    type: "sse",
    options: {
      port, // Now guaranteed to be a number
      cors: {
        allowOrigin: "*"
      }
    }
  }
});

server.start();