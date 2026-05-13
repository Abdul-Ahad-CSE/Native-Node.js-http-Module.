import type { IncomingMessage, ServerResponse } from "node:http";
import { getProductById, getProducts } from "../controller/product.controller";

export const routes = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  // Ignore favicon requests
  if (url === "/favicon.ico") {
    res.statusCode = 204; // No Content
    return res.end();
  }

  //console.log(url);
  // Home Route
  if (url === "/" && method === "GET") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");

    const data = {
      success: true,
      message: "This is home route",
    };

    return res.end(JSON.stringify(data));
  }

  if (url === "/products" && method === "GET") {
    return getProducts(res);
  }

  //route for single product
  if (url?.startsWith("/products/") && method === "GET") {
    const segments = url.split("/");
    const id = segments[2];

    // If id is null, undefined, or an empty string, this check fails
    if (id) {
      return getProductById(res, id);
    }
  }

  // 404 Route
  res.setHeader("Content-Type", "application/json");

  return res.end(
    JSON.stringify({
      success: false,
      message: "404 Not Found",
    }),
  );
};
