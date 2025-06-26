import { useState } from "react";
import "./ProductsTable.css";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filterColor, setFilterColor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [loading, setLoading] = useState(false);

  // this is the function to handle the search button click 
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/scrape/?product=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await response.json();
      const enriched = data.products.map((p, index) => ({
        ...p,
        id: index,
      }));

      setProducts(enriched);
    } catch (error) {
      console.error("Не удалось получить продукты:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesColor = !filterColor || product.color === filterColor;
      const matchesSearch =
        product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());

      // in this code snippet, we trim the price to only return a number to use in filtering by price 
      const cleanPrice = parseFloat(
        product.price
          ?.toString()
          .replace(/[^\d.]/g, "")
          .replace(",", ".")
      );
      const withinMin = minPrice === "" || cleanPrice >= parseFloat(minPrice);
      const withinMax = maxPrice === "" || cleanPrice <= parseFloat(maxPrice);

      return (
        matchesColor &&
        matchesSearch &&
        !isNaN(cleanPrice) &&
        withinMin &&
        withinMax
      );
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "price") {
        const aPrice = parseFloat(
          aValue
            ?.toString()
            .replace(/[^\d.]/g, "")
            .replace(",", ".")
        );
        const bPrice = parseFloat(
          bValue
            ?.toString()
            .replace(/[^\d.]/g, "")
            .replace(",", ".")
        );
        return sortConfig.direction === "asc"
          ? aPrice - bPrice
          : bPrice - aPrice;
      }
      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const uniqueColors = [...new Set(products.map((p) => p.color))];

  return (
    <div className="table-container">
      <h2>Поиск данных о продуктах</h2>

      <div className="search">
        <input
          type="text"
          placeholder="Поиск по имени"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Поиск</button>
      </div>
      {loading ? (
        <p>Загрузка...</p>
      ) : products.length > 0 ? (
        <>
          <div className="filters">
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
            >
              <option value="">Все цвета</option>
              {uniqueColors.map((color) => (
                <option key={color}>{color}</option>
              ))}
            </select>

            <input
              type="number"
              placeholder="от"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ width: "100px" }}
            />
            <input
              type="number"
              placeholder="до"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: "100px" }}
            />
          </div>

          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Продукт</th>
                  <th onClick={() => handleSort("brand")}>
                    Бренд{" "}
                    {sortConfig.key === "brand"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                  <th onClick={() => handleSort("price")}>
                    Цена{" "}
                    {sortConfig.key === "price"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                  <th onClick={() => handleSort("color")}>
                    Цвет{" "}
                    {sortConfig.key === "color"
                      ? sortConfig.direction === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={product.image}
                          alt={product.image}
                          width="60"
                        />
                        <span>{product.name}</span>
                      </td>
                      <td>{product.brand}</td>
                      <td>{product.price}</td>
                      <td>{product.color}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Ничего не найдено
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      ) : null}
    </div>
  );
};

export default ProductTable;
