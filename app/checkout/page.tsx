'use client';
import { useState } from 'react';

export default function CheckoutPage() {
  const [region, setRegion] = useState('Greater Accra');
  const [deliveryFee, setDeliveryFee] = useState(30);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, paying, escrow_locked, released

  const ghanaRegions = [
    { name: 'Greater Accra', fee: 30 },
    { name: 'Ashanti', fee: 45 },
    { name: 'Western', fee: 50 },
    { name: 'Central', fee: 40 },
    { name: 'Eastern', fee: 40 },
    { name: 'Volta', fee: 45 },
    { name: 'Northern', fee: 60 },
    { name: 'Upper East', fee: 65 },
    { name: 'Upper West', fee: 65 },
    { name: 'Bono', fee: 50 },
    { name: 'Bono East', fee: 55 },
    { name: 'Ahafo', fee: 55 },
    { name: 'Oti', fee: 50 },
    { name: 'North East', fee: 60 },
    { name: 'Savannah', fee: 60 },
    { name: 'Western North', fee: 55 }
  ];

  const handleRegionChange = (selectedName: string) => {
    const selected = ghanaRegions.find(r => r.name === selectedName);
    if (selected) {
      setRegion(selected.name);
      setDeliveryFee(selected.fee);
    }
  };

  const handlePaystackPayment = () => {
    setPaymentStatus('paying');
    setTimeout(() => {
      setPaymentStatus('escrow_locked');
      alert('⚡ Paystack MoMo Payment Successful!\n🔒 GHS Funds are securely locked in Akwaaba Mall Escrow.');
    }, 2000);
  };

  const releaseEscrowFunds = () => {
    setPaymentStatus('released');
    alert('🎉 Delivery Confirmed! Funds have been released to the Vendor\'s MoMo wallet.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '450px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Akwaaba Checkout</h2>
      
      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#f9f9f9', marginBottom: '20px' }}>
        <h4>📍 Ghana Delivery Setup</h4>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Your Delivery Region</label>
        <select 
          value={region} 
          onChange={(e) => handleRegionChange(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          {ghanaRegions.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
        </select>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
          Delivery Fee: <strong>GHS {deliveryFee}.00</strong>
        </p>
      </div>

      <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
        <h4>💳 Paystack Payment Gateway</h4>
        
        {paymentStatus === 'idle' && (
          <button onClick={handlePaystackPayment} style={{ width: '100%', background: '#3bb75e', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px' }}>
            Pay via Mobile Money / Card
          </button>
        )}

        {paymentStatus === 'paying' && (
          <p style={{ textAlign: 'center', color: '#ffa500', fontWeight: 'bold' }}>Connecting Paystack MoMo Secure Gateway...</p>
        )}

        {paymentStatus === 'escrow_locked' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#d97706', fontWeight: 'bold' }}>🛡️ Order Status: Funds Secured in Escrow</p>
            <p style={{ fontSize: '13px', color: '#666' }}>Once your goods arrive via local transport/courier, tap the button below to pay the vendor.</p>
            <button onClick={releaseEscrowFunds} style={{ width: '100%', background: '#ffa500', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
              🤝 Confirm Delivery (Release Funds)
            </button>
          </div>
        )}

        {paymentStatus === 'released' && (
          <p style={{ textAlign: 'center', color: '#22c55e', fontWeight: 'bold' }}>✅ Transaction Finished Successfully!</p>
        )}
      </div>
    </div>
  );
}
