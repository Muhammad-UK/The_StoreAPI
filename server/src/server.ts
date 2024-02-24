import express from "express";
import {
  client,
  createFavorite,
  createProduct,
  createTables,
  createUser,
  deleteFavorite,
  fetchFavorites,
  fetchProducts,
  fetchUsers,
} from "./db";
import { Favorite, Product, User } from "./types";

const app = express();
app.use(express.json());

// GET Routes:
app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (error) {
    next(error);
  }
});
app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (error) {
    next(error);
  }
});
app.get("/api/users/:user_id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.user_id));
  } catch (error) {
    next(error);
  }
});

//POST Routes:
app.post("/api/users", async (req, res, next) => {
  try {
    const newUser: User = {
      username: req.body.username,
      password: req.body.password,
    };
    res.status(201).send(await createUser(newUser));
  } catch (error) {
    next(error);
  }
});
app.post("/api/products", async (req, res, next) => {
  try {
    const newProduct: Product = {
      name: req.body.name,
    };
    res.status(201).send(await createProduct(newProduct));
  } catch (error) {
    next(error);
  }
});
app.post("/api/users/:user_id/favorites", async (req, res, next) => {
  try {
    const newFavorite: Favorite = {
      user_id: req.params.user_id,
      product_id: req.body.product_id,
    };
    res.status(201).send(await createFavorite(newFavorite));
  } catch (error) {
    next(error);
  }
});

// DELETE Route:
app.delete(
  "/api/users/:user_id/favorites/:favorite_id",
  async (req, res, next) => {
    try {
      await deleteFavorite(req.params.favorite_id, req.params.user_id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
);

// Server Initialization:
const init = async () => {
  console.log("Connecting to database...");
  await client.connect();
  console.log("Connected successfully");

  await createTables();
  console.log("Created tables");

  const [Liam, Nora, Evan, Maya]: User[] = await Promise.all([
    createUser({ username: "Liam", password: "Liam123" }),
    createUser({ username: "Nora", password: "Nora5678" }),
    createUser({ username: "Evan", password: "Evan999" }),
    createUser({ username: "Maya", password: "Maya2024" }),
  ]);
  const [Milk, Eggs, Rice, Pasta, Beef, Beans, Chips, Bread]: Product[] =
    await Promise.all([
      createProduct({ name: "Milk" }),
      createProduct({ name: "Eggs" }),
      createProduct({ name: "Rice" }),
      createProduct({ name: "Pasta" }),
      createProduct({ name: "Beef" }),
      createProduct({ name: "Beans" }),
      createProduct({ name: "Chips" }),
      createProduct({ name: "Bread" }),
    ]);

  console.log("Created users and products");
  console.log(await fetchUsers());
  console.log(await fetchProducts());

  await Promise.all([
    createFavorite({ product_id: Milk.id!, user_id: Liam.id! }),
    createFavorite({ product_id: Bread.id!, user_id: Maya.id! }),
    createFavorite({ product_id: Beef.id!, user_id: Evan.id! }),
    createFavorite({ product_id: Rice.id!, user_id: Nora.id! }),
    createFavorite({ product_id: Beans.id!, user_id: Nora.id! }),
  ]);
  console.log("Created some favorites");
  console.log(
    "Liam's favorites: " + JSON.stringify(await fetchFavorites(Liam.id!))
  );
  console.log(
    "Nora's favorites: " + JSON.stringify(await fetchFavorites(Nora.id!))
  );

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));

  console.log("Some curl commands to test:");

  console.log("GET tests:");
  console.log(`curl localhost:3000/api/users`);
  console.log(`curl localhost:3000/api/products`);
  console.log(`curl localhost:3000/api/users/${Maya.id}/favorites`);

  console.log("POST tests:");

  console.log("Create a user:");
  console.log(
    `curl localhost:3000/api/users -X POST -H 'Content-type:application/json' -d '{"username":"Josh", "password": "j0shi$re4llyc0Ol"}'`
  );

  console.log("Create a product:");
  console.log(
    `curl localhost:3000/api/products -X POST -H 'Content-type:application/json' -d '{"name":"Trix"}'`
  );

  console.log("Make the new user favorite the new product:");
  console.log(
    `curl localhost:3000/api/users/<insert created user_id>/favorites -X POST -H 'Content-type:application/json' -d '{"product_id": "<insert created product_id>"}'`
  );

  console.log("Delete the new favorite:");
  console.log(
    `curl localhost:3000/api/users/<insert the user_id>/favorites/<insert the favorites_id> -X DELETE`
  );
};

init();
