import type { IncomingMessage, ServerResponse } from "http";
import {
  createProductInDB,
  deleteProductFromDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductInDB,
} from "../service/product.service";
import { parseBody } from "../utility/parseBody";

// 1. Get All Products
export const getProducts = (res: ServerResponse) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");

  const products = getAllProductsFromDB();

  return res.end(
    JSON.stringify({
      success: true,
      data: products,
    }),
  );
};
// 2. Get Single Product by ID
export const getProductById = (res: ServerResponse, id: string) => {
  // Convert the string ID from the URL to a number for the service
  const product = getSingleProductFromDB(Number(id));

  res.setHeader("Content-Type", "application/json");

  // If the product doesn't exist, send a 404
  if (!product) {
    res.statusCode = 404;
    return res.end(
      JSON.stringify({
        success: false,
        message: `Product with ID ${id} not found`,
      }),
    );
  }

  // If it does exist, send a 200
  res.statusCode = 200;
  return res.end(
    JSON.stringify({
      success: true,
      data: product,
    }),
  );
};

//3. post a new product
export const createProduct = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  try {
    // 1. Wait for the data chunks to assemble
    const body = await parseBody(req);

    // 2. Send the assembled data to the database
    const newProduct = createProductInDB(body);
    console.log(newProduct);

    // 3. Respond with 201 Created
    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        success: true,
        message: "Product created successfully",
        data: newProduct,
      }),
    );
  } catch (error) {
    // If JSON parsing fails, return a 400 Bad Request
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        success: false,
        message: "Invalid JSON data provided",
      }),
    );
  }
};

// Update an existing product (PUT)
export const updateProduct = async (
  req: IncomingMessage,
  res: ServerResponse,
  id: string,
) => {
  try {
    // 1. Wait for incoming data
    const body = await parseBody(req);

    // 2. Send to service layer (convert ID to number!)
    const updatedProduct = updateProductInDB(Number(id), body);

    res.setHeader("Content-Type", "application/json");

    // 3. Handle 404 if it didn't exist
    if (!updatedProduct) {
      res.statusCode = 404;
      return res.end(
        JSON.stringify({
          success: false,
          message: `Product with ID ${id} not found`,
        }),
      );
    }

    // 4. Respond with 200 OK
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        success: true,
        message: "Product updated successfully",
        data: updatedProduct,
      }),
    );
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({ success: false, message: "Invalid JSON data provided" }),
    );
  }
};

// Delete a product (DELETE)
export const deleteProduct = (res: ServerResponse, id: string) => {
  // 1. Attempt deletion in the service layer
  const isDeleted = deleteProductFromDB(Number(id));

  res.setHeader("Content-Type", "application/json");

  // 2. Handle 404 if it didn't exist
  if (!isDeleted) {
    res.statusCode = 404;
    return res.end(
      JSON.stringify({
        success: false,
        message: `Product with ID ${id} not found`,
      }),
    );
  }

  // 3. Respond with 200 OK
  res.statusCode = 200;
  return res.end(
    JSON.stringify({
      success: true,
      message: `Product with ID ${id} deleted successfully`,
    }),
  );
};
