'use client';
import { useState } from 'react';

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    region: 'Greater Accra',
    category: 'Textiles'
  });

  const regions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 
    'Eastern', 'Volta', 'Northern', 'Upper East', 'Upper West'
  ];

  const categories = ['Textiles', 'Beauty', 'Food', 'Crafts'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Registration submitted for ${formData.businessName}! Next setup step: Connecting your Paystack Wallet.`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#333', textAlign: 'center' }}>Akwaaba Mall</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>Register as a Vendor to start selling across Ghana</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Shop / Business Name</label>
          <input 
            type="text" 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ghana Phone Number (Mobile Money)</label>
          <input 
            type="tel" 
            required 
            placeholder="024XXXXXXX"
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Primary Region</label>
          <select 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            onChange={(e) => setFormData({...formData, region: e.target.value})}
          >
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product Category</label>
          <select 
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button type="submit" style={{ background: '#ffa500', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
          Create Vendor Account
        </button>
      </form>
    </div>
  );
}
