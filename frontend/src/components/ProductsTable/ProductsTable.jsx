import { useState } from "react";
import './ProductsTable.css';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [filterColor, setFilterColor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/scrape/?product=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      const enriched = data.products.map((p, index) => ({
        ...p,
        id: index,
        size: "M",
        photo: `https://via.placeholder.com/60?text=${encodeURIComponent(p.name.slice(0, 3))}`
      }));
      setProducts(enriched);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    );
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesColor = !filterColor || product.color === filterColor;
      const matchesSearch =
        product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase());

      const cleanPrice = parseFloat(
        product.price?.toString().replace(/[^\d.]/g, "").replace(",", ".")
      );
      const withinMin = minPrice === '' || cleanPrice >= parseFloat(minPrice);
      const withinMax = maxPrice === '' || cleanPrice <= parseFloat(maxPrice);

      return matchesColor && matchesSearch && !isNaN(cleanPrice) && withinMin && withinMax;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === "price") {
        const aPrice = parseFloat(aValue?.toString().replace(/[^\d.]/g, "").replace(",", "."));
        const bPrice = parseFloat(bValue?.toString().replace(/[^\d.]/g, "").replace(",", "."));
        return sortConfig.direction === "asc" ? aPrice - bPrice : bPrice - aPrice;
      }
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  const uniqueColors = [...new Set(products.map((p) => p.color))];

  return (
    <div className="table-container">
      <h2>Products Data</h2>

        <div className="search">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      <div className="filters">

        <select value={filterColor} onChange={(e) => setFilterColor(e.target.value)}>
          <option value="">All Colors</option>
          {uniqueColors.map((color) => (
            <option key={color}>{color}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ width: "100px" }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: "100px" }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Product</th>
              <th onClick={() => handleSort("brand")}>
                Brand {sortConfig.key === "brand" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("price")}>
                Price {sortConfig.key === "price" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("color")}>
                Color {sortConfig.key === "color" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={product.image} alt={product.image} width="60" />
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
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductTable;
