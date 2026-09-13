'use client';
import { useState } from 'react';

export default function VendorDashboard() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Kente Print Everyday Tote', price: 150, category: 'Textiles' }
  ]);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Textiles');

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    
    const newProd = {
      id: products.length + 1,
      name: newName,
      price: parseFloat(newPrice),
      category: newCategory
    };
    
    setProducts([...products, newProd]);
    alert(`🎉 Successfully added "${newName}" to Akwaaba Mall storefront layout!`);
    setNewName('');
    setNewPrice('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#333' }}>🏪 Vendor Command Center</h2>
      <p style={{ color: '#666' }}>Manage your shop inventory across Ghana</p>
      
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#f9f9f9', marginBottom: '25px' }}>
        <h4>➕ List a New Product</h4>
        <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Item Name</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price (GHS)</label>
            <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="Textiles">Textiles & Fabrics</option>
              <option value="Beauty">Fragrances & Beauty</option>
              <option value="Food">Food & Spices</option>
              <option value="Crafts">Authentic Crafts</option>
            </select>
          </div>
          <button type="submit" style={{ background: '#3bb75e', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', marginTop: '5px' }}>
            Publish Item Live
          </button>
        </form>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h4>📦 Your Active Listings</h4>
        {products.map(p => (
          <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <div>
              <strong>{p.name}</strong> <br />
              <span style={{ fontSize: '12px', color: '#888' }}>{p.category}</span>
            </div>
            <strong style={{ color: '#ffa500' }}>GHS {p.price}.00</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
