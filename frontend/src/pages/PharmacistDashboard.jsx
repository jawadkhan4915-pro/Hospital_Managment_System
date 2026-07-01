import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Pill, AlertTriangle, Plus, PackageCheck, Ban } from 'lucide-react';

const PharmacistDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  // New Item Form
  const [itemForm, setItemForm] = useState({
    itemName: '',
    category: 'Medicines',
    quantity: 100,
    reorderLevel: 20,
    expiryDate: '',
    supplier: '',
    price: 15,
  });

  // Dispense Form
  const [dispenseItem, setDispenseItem] = useState('');
  const [dispenseQty, setDispenseQty] = useState(1);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      const itemsRes = await fetchWithAuth('/api/v1/inventory');
      const itemsData = await itemsRes.json();
      setInventory(itemsData.data || []);

      const lowRes = await fetchWithAuth('/api/v1/inventory/low-stock');
      const lowData = await lowRes.json();
      setLowStock(lowData.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetchWithAuth('/api/v1/inventory', {
        method: 'POST',
        body: JSON.stringify({
          ...itemForm,
          expiryDate: itemForm.expiryDate ? new Date(itemForm.expiryDate) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add item');
      }

      setMessage('Inventory item added successfully!');
      setItemForm({ itemName: '', category: 'Medicines', quantity: 100, reorderLevel: 20, expiryDate: '', supplier: '', price: 15 });
      loadInventoryData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleDispense = async (e) => {
    e.preventDefault();
    if (!dispenseItem || dispenseQty <= 0) return;
    setMessage('');

    try {
      const selected = inventory.find(i => i._id === dispenseItem);
      if (!selected) return;

      if (selected.quantity < dispenseQty) {
        throw new Error(`Insufficient stock. Only ${selected.quantity} available.`);
      }

      const newQty = selected.quantity - dispenseQty;
      const res = await fetchWithAuth(`/api/v1/inventory/${selected._id}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQty }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to dispense');
      }

      setMessage(`Dispensed ${dispenseQty} of ${selected.itemName} successfully!`);
      setDispenseItem('');
      setDispenseQty(1);
      loadInventoryData();
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-primary)' }}>Loading pharmacy stores...</div>;

  return (
    <div style={styles.container}>
      <h2 style={{ marginBottom: '24px' }}>Pharmacy & Inventory Hub</h2>

      {message && (
        <div style={message.includes('Error') ? styles.errorBox : styles.successBox}>
          {message}
        </div>
      )}

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="glass" style={styles.alertBanner}>
          <div style={styles.alertHeader}>
            <AlertTriangle size={20} color="var(--color-danger)" />
            <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>Low Stock Warnings!</span>
          </div>
          <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>
            The following items are below their minimum threshold limits: {lowStock.map(i => i.itemName).join(', ')}
          </p>
        </div>
      )}

      <div style={styles.contentGrid}>
        {/* Add Inventory Item */}
        <div className="glass" style={styles.card}>
          <h3 style={styles.cardTitle}><Plus size={20} color="var(--color-primary)" /> Register Store Supply / Medicine</h3>
          <form onSubmit={handleAddItem} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Item Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Paracetamol 500mg"
                value={itemForm.itemName}
                onChange={(e) => setItemForm({ ...itemForm, itemName: e.target.value })}
                required
              />
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={itemForm.category}
                  onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                >
                  <option value="Medicines">Medicines</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Assets">Assets</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Unit Price ($)</label>
                <input
                  type="number"
                  className="form-control"
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Opening Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Reorder Alert Level</label>
                <input
                  type="number"
                  className="form-control"
                  value={itemForm.reorderLevel}
                  onChange={(e) => setItemForm({ ...itemForm, reorderLevel: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>
            <div style={styles.formRow}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={itemForm.expiryDate}
                  onChange={(e) => setItemForm({ ...itemForm, expiryDate: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Supplier</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="PharmaCorp"
                  value={itemForm.supplier}
                  onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add Store Entry</button>
          </form>
        </div>

        {/* Dispense Medicine Panel */}
        <div className="glass" style={styles.card}>
          <h3 style={styles.cardTitle}><PackageCheck size={20} color="var(--color-success)" /> Dispense Medicine Stock</h3>
          <form onSubmit={handleDispense} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Supply Item</label>
              <select
                className="form-control"
                value={dispenseItem}
                onChange={(e) => setDispenseItem(e.target.value)}
                required
              >
                <option value="">-- Choose Item --</option>
                {inventory.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.itemName} (Available: {item.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dispense Quantity</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={dispenseQty}
                onChange={(e) => setDispenseQty(parseInt(e.target.value))}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ backgroundColor: 'var(--color-success)' }}>
              Dispense Stock Units
            </button>
          </form>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass" style={{ ...styles.card, marginTop: '30px' }}>
        <h3 style={styles.cardTitle}><Pill size={20} color="var(--color-primary)" /> Medicine Stock Directory</h3>
        <div className="table-container" style={{ marginTop: '15px' }}>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Units In Stock</th>
                <th>Reorder Level</th>
                <th>Unit Price</th>
                <th>Expiry Date</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Inventory stores empty.</td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const isLow = item.quantity <= item.reorderLevel;
                  const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
                  return (
                    <tr key={item._id}>
                      <td><span style={{ fontWeight: 600 }}>{item.itemName}</span></td>
                      <td>{item.category}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: isLow ? 'var(--color-danger)' : 'inherit' }}>
                          {item.quantity}
                        </span>
                        {isLow && <span className="badge badge-danger" style={{ marginLeft: '8px' }}>Low</span>}
                      </td>
                      <td>{item.reorderLevel}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        {item.expiryDate ? (
                          <span style={{ color: isExpired ? 'var(--color-danger)' : 'inherit' }}>
                            {new Date(item.expiryDate).toLocaleDateString()}
                            {isExpired && <span className="badge badge-danger" style={{ marginLeft: '8px' }}>Expired</span>}
                          </span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>{item.supplier || 'N/A'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    animation: 'fadeIn 0.5s ease-out',
  },
  alertBanner: {
    padding: '16px',
    borderRadius: 'var(--border-radius-sm)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderLeft: '4px solid var(--color-danger)',
    marginBottom: '25px',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
  },
  card: {
    padding: '30px',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--box-shadow-md)',
  },
  cardTitle: {
    fontSize: '1.25rem',
    marginBottom: '20px',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formRow: {
    display: 'flex',
    gap: '15px',
  },
  successBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--color-success)',
    padding: '12px',
    borderRadius: 'var(--border-radius-sm)',
    marginBottom: '20px',
    fontSize: '0.9rem',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--color-danger)',
    padding: '12px',
    borderRadius: 'var(--border-radius-sm)',
    marginBottom: '20px',
    fontSize: '0.9rem',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
};

export default PharmacistDashboard;
