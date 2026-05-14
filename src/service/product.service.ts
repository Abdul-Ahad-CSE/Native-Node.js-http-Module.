import fs from "node:fs";
import path from "node:path";

const getDBData = () => {
  // 1. Create an absolute path to the file
  const filePath = path.join(process.cwd(), "src", "database", "db.json");
  // 2. Read the file content as a string
  const fileData = fs.readFileSync(filePath, "utf-8");
  // 3. Parse the string into a JavaScript object
  return JSON.parse(fileData);
};

// Function for get localhost:5000/products
export const getAllProductsFromDB = () => {
  const jsonData = getDBData();
  return jsonData.products;
};

// Function for get localhost:5000/products/:id
export const getSingleProductFromDB = (id: number) => {
  const jsonData = getDBData(); // Calls the same helper above
  return jsonData.products.find((p: any) => p.id === id);
};

// Function for POST localhost:5000/products
export const createProductInDB = (newProductData: any) => {
  const filePath = path.join(process.cwd(), "src", "database", "db.json");
  const jsonData = getDBData(); // Read existing data

  // 1. Generate a new ID (finds the highest current ID and adds 1)
  const newId = jsonData.products.length > 0 
    ? Math.max(...jsonData.products.map((p: any) => p.id)) + 1 
    : 1;

  // 2. Create the full product object
  const newProduct = {
    id: newId,
    ...newProductData,
  };

  // 3. Push the new product to our javascript array
  jsonData.products.push(newProduct);

  // 4. Write the updated array back to db.json as a string
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

  return newProduct;
};

// Function for PUT localhost:5000/products/:id
export const updateProductInDB = (id: number, updatedData: any) => {
  const filePath = path.join(process.cwd(), "src", "database", "db.json");
  const jsonData = getDBData();

  // 1. Find the index of the product
  const index = jsonData.products.findIndex((p: any) => p.id === id);

  // 2. If it doesn't exist, return null
  if (index === -1) {
    return null;
  }

  // 3. Merge the old data with the new data (ensuring the ID stays the same)
  const updatedProduct = {
    ...jsonData.products[index],
    ...updatedData,
    id: id, 
  };

  jsonData.products[index] = updatedProduct;

  // 4. Save back to the file
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

  return updatedProduct;
};

// Function for DELETE localhost:5000/products/:id
export const deleteProductFromDB = (id: number) => {
  const filePath = path.join(process.cwd(), "src", "database", "db.json");
  const jsonData = getDBData();

  const initialLength = jsonData.products.length;

  // 1. Filter out the product with the matching ID
  jsonData.products = jsonData.products.filter((p: any) => p.id !== id);

  // 2. If the length hasn't changed, the product wasn't found
  if (jsonData.products.length === initialLength) {
    return false;
  }

  // 3. Save the new array back to the file
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf-8");

  return true;
};
