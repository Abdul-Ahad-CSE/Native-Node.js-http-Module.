import type { IncomingMessage, ServerResponse } from "node:http";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controller/product.controller";

// Helper function to extract ID from URL
const extractIdFromUrl = (url?: string): string | null => {
  if (!url) return null;

  const segments = url.split("/");
  return segments[2] || null;
};

export const routes = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  // Common Headers
  res.setHeader("Content-Type", "application/json");

  // Ignore favicon requests
  if (url === "/favicon.ico") {
    res.statusCode = 204;
    return res.end();
  }

  // Home Route
  if (url === "/" && method === "GET") {
    return res.end(
      JSON.stringify({
        success: true,
        message: "This is home route",
      }),
    );
  }

  // =========================
  // PRODUCTS ROUTES
  // =========================

  // GET ALL PRODUCTS
  if (url === "/products" && method === "GET") {
    return getProducts(res);
  }

  // Extract product ID once
  const productId = extractIdFromUrl(url);

  // GET SINGLE PRODUCT
  if (url?.startsWith("/products/") && method === "GET") {
    if (!productId) {
      res.statusCode = 400;

      return res.end(
        JSON.stringify({
          success: false,
          message: "Product ID is required",
        }),
      );
    }

    return getProductById(res, productId);
  }

  // CREATE PRODUCT
  if (url === "/products" && method === "POST") {
    return createProduct(req, res);
  }

  // UPDATE PRODUCT
  if (url?.startsWith("/products/") && method === "PUT") {
    if (!productId) {
      res.statusCode = 400;

      return res.end(
        JSON.stringify({
          success: false,
          message: "Product ID is required",
        }),
      );
    }

    return updateProduct(req, res, productId);
  }

  // DELETE PRODUCT
  if (url?.startsWith("/products/") && method === "DELETE") {
    if (!productId) {
      res.statusCode = 400;

      return res.end(
        JSON.stringify({
          success: false,
          message: "Product ID is required",
        }),
      );
    }

    return deleteProduct(res, productId);
  }

  // =========================
  // 404 ROUTE
  // =========================
  res.statusCode = 404;

  return res.end(
    JSON.stringify({
      success: false,
      message: "404 Not Found",
    }),
  );
};