import { useEffect, useState } from "react";
import "./App.css";
import { Favorite, Product, User } from "../../server/src/types";
import { fetchProducts } from "../../server/src/db";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const json = await response.json();
      setUsers(json as User[]);
    };
    fetchUsers();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();
      setProducts(json as Product[]);
    };
    fetchProducts();
  }, []);
  // useEffect(() => {
  //   const fetchFavorites = async () => {
  //     const response = await fetch("/api/favorites");
  //     const json = await response.json();
  //     setFavorites(json as Favorite[]);
  //   };
  //   fetchFavorites();
  // }, []);
  return (
    <div className="p-4 flex flex-wrap gap-56 mb-6">
      <div className="space-y-2">
        <h1 className="border-violet-700 border-solid border-4 p-4">Users</h1>
        <ul className="border-violet-700 border-solid border-2 p-2">
          {users.map((user) => {
            return <li key={user.id}>{user.username}</li>;
          })}
        </ul>
      </div>
      <div className="space-y-2">
        <h1 className="border-pink-600 border-solid border-4 p-4">Products</h1>
        <ul className="border-pink-600 border-solid border-2 p-2">
          {products.map((product) => {
            return <li key={product.id}>{product.name}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
