import type { IncomingMessage } from "node:http";

export const parseBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = "";

    // 1. Listen for chunks of data arriving
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // 2. Listen for the end of the transmission
    req.on("end", () => {
      try {
        if (body) {
          // 3. Parse the assembled JSON string back into a JS Object
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (err) {
        reject(err);
      }
    });

    // Handle potential stream errors
    req.on("error", (err) => {
      reject(err);
    });
  });
};