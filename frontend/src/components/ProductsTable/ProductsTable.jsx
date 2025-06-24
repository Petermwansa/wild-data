import { useState } from "react";
import products from "../../data/products";
import './ProductsTable.css'

const ProductTable = () => {

  const [filterColor, setFilterColor] = useState('');
  const [filterSize, setFilterSize] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc'});


  // here we handle the sorting 
  const handleSort = (key) => {
    setSortConfig((prev) => 
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc'}
        : { key, direction: 'asc' }
    );
  }


  // the function for filtering the products based on the filters applied 
 const filteredProducts = products
    .filter((product) => {
      const matchesColor = !filterColor || product.color === filterColor;
      const matchesSize = !filterSize || product.size === filterSize;
      const matchesSearch =
        product.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()); // include name in search
      return matchesColor && matchesSize && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

  const uniqueColors = [...new Set(products.map((p) => p.color))];
  const uniqueSizes = [...new Set(products.map((p) => p.size))];

  return (
    <div className="table-container">
      <h2>Products Data</h2>

      <div className="filters">
        <select
          value={filterColor}
          onChange={(e) => setFilterColor(e.target.value)}
        >
          <option value="">All Colors</option>
          {uniqueColors.map((color) => (
            <option key={color}>{color}</option>
          ))}
        </select>

        <select
          value={filterSize}
          onChange={(e) => setFilterSize(e.target.value)}
        >
          <option value="">All Sizes</option>
          {uniqueSizes.map((size) => (
            <option key={size}>{size}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name, color or size"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th> {/* Renamed from Photo */}
            <th onClick={() => handleSort("price")}>
              Price{" "}
              {sortConfig.key === "price"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => handleSort("color")}>
              Color{" "}
              {sortConfig.key === "color"
                ? sortConfig.direction === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </th>
            <th onClick={() => handleSort("size")}>
              Size{" "}
              {sortConfig.key === "size"
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
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img src={product.photo} alt={product.name} width="60" />
                  <span>{product.name}</span>
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.color}</td>
                <td>{product.size}</td>
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
    </div>
  );
};

export default ProductTable;
