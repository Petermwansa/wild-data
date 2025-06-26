import { useState } from 'react';

function Display() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:8000/api/scrape/?product=${encodeURIComponent(search)}`);
    const data = await res.json();
    setProducts(data.products || []);
  };

  return (
    <div>
      <h1>Product Search</h1>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search product..."
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {products.map((item, idx) => (
          <li key={idx}>
            <strong>{item.name}</strong> - {item.price} - {item.color}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Display;
