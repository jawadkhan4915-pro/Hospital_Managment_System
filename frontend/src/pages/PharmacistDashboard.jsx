import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { SkeletonCard, SkeletonTable } from '../components/SkeletonLoader.jsx';
import { Pill, AlertTriangle, Plus, PackageCheck, Search, QrCode, CheckCircle2 } from 'lucide-react';

const PharmacistDashboard = () => {
  const { fetchWithAuth } = useContext(AuthContext);
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // QR Scanner Input & Decoded Payload State
  const [qrInput, setQrInput] = useState('');
  const [scannedPrescription, setScannedPrescription] = useState(null);

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

  // Manual Dispense Form
  const [dispenseItem, setDispenseItem] = useState('');
  const [dispenseQty, setDispenseQty] = useState(1);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      const [itemsRes, lowRes] = await Promise.all([
        fetchWithAuth('/api/v1/inventory'),
        fetchWithAuth('/api/v1/inventory/low-stock'),
      ]);

      const [itemsData, lowData] = await Promise.all([
        itemsRes.json(),
        lowRes.json(),
      ]);

      setInventory(itemsData.data || []);
      setLowStock(lowData.data || []);
    } catch (e) {
      showError('Failed to load pharmacy stock catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleScanQr = (e) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    try {
      const parsed = JSON.parse(qrInput.trim());
      if (parsed.type !== 'PRESCRIPTION_SLIP' && !parsed.prescription) {
        showError('Invalid prescription QR payload format');
        return;
      }
      setScannedPrescription(parsed);
      showSuccess(`QR Code Scanned for ${parsed.patientName || 'Patient'}`);
    } catch (err) {
      showError('Could not decode QR Code string payload');
    }
  };

  const handleDispenseScannedRx = async () => {
    if (!scannedPrescription || !scannedPrescription.prescription) return;
    setSubmitting(true);

    try {
      let dispensedCount = 0;
      for (const med of scannedPrescription.prescription) {
        const itemInStock = inventory.find(i => i.itemName.toLowerCase().includes(med.medicineName.toLowerCase()));
        if (itemInStock && itemInStock.quantity > 0) {
          const newQty = Math.max(0, itemInStock.quantity - 1);
          await fetchWithAuth(`/api/v1/inventory/${itemInStock._id}/stock`, {
            method: 'PUT',
            body: JSON.stringify({ quantity: newQty }),
          });
          dispensedCount++;
        }
      }

      showSuccess(`Dispensed ${dispensedCount} prescribed items successfully!`);
      setScannedPrescription(null);
      setQrInput('');
      loadInventoryData();
    } catch (err) {
      showError('Failed to complete prescription stock fulfillment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetchWithAuth('/api/v1/inventory', {
        method: 'POST',
        body: JSON.stringify({
          ...itemForm,
          expiryDate: itemForm.expiryDate ? new Date(itemForm.expiryDate) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add item');

      showSuccess(`Added ${itemForm.itemName} to inventory!`);
      setItemForm({ itemName: '', category: 'Medicines', quantity: 100, reorderLevel: 20, expiryDate: '', supplier: '', price: 15 });
      loadInventoryData();
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispense = async (e) => {
    e.preventDefault();
    if (!dispenseItem || dispenseQty <= 0) {
      showError('Please select item and valid quantity');
      return;
    }

    try {
      const selected = inventory.find(i => i._id === dispenseItem);
      if (!selected) return;

      if (selected.quantity < dispenseQty) {
        showWarning(`Insufficient stock. Only ${selected.quantity} available.`);
        return;
      }

      const newQty = selected.quantity - dispenseQty;
      const res = await fetchWithAuth(`/api/v1/inventory/${selected._id}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ quantity: newQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to dispense');

      showSuccess(`Dispensed ${dispenseQty} units of ${selected.itemName}!`);
      setDispenseItem('');
      setDispenseQty(1);
      loadInventoryData();
    } catch (err) {
      showError(err.message);
    }
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      return item.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [inventory, searchQuery]);

  if (loading) {
    return (
      <div>
        <h2 style={{ marginBottom: '24px' }}>Pharmacy & Inventory Hub</h2>
        <SkeletonCard count={3} />
        <SkeletonTable rows={5} cols={7} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={styles.container}>
      <div>
        <h2>Pharmacy & Dispensary Station</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          QR Code Prescription Scanning, Automated Dispensing & Stock Management
        </p>
      </div>

      {/* QR Code Scanner & Prescription Parser Panel */}
      <div className="card" style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid rgba(37, 99, 235, 0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <QrCode size={24} color="var(--color-primary)" />
          <div>
            <h3 style={{ fontSize: '1.05rem', margin: 0 }}>Scan Doctor Prescription QR Code</h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
              Paste or scan doctor prescription QR payload to load prescribed medicines instantly
            </p>
          </div>
        </div>

        <form onSubmit={handleScanQr} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder='Paste or scan QR Code text payload (e.g. {"type":"PRESCRIPTION_SLIP",...})'
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            style={{ flex: 1, minWidth: '280px' }}
          />
          <button type="submit" className="btn btn-primary">
            <QrCode size={16} /> Scan QR Code
          </button>
        </form>

        {scannedPrescription && (
          <div style={{ marginTop: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>
                Prescription File: {scannedPrescription.patientName} (CNIC: {scannedPrescription.cnic})
              </h4>
              <button className="btn btn-secondary btn-sm" onClick={() => setScannedPrescription(null)}>Clear</button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              <strong>Diagnosis:</strong> {scannedPrescription.diagnosis} | <strong>Signed By:</strong> {scannedPrescription.signature}
            </p>

            <h5 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '6px' }}>Prescribed Medicine Items:</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              {scannedPrescription.prescription?.map((med, idx) => (
                <div key={idx} style={{ padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <strong>{med.medicineName}</strong> - {med.dosage} ({med.frequency}) for {med.duration}
                </div>
              ))}
            </div>

            <button onClick={handleDispenseScannedRx} className="btn btn-success" disabled={submitting}>
              <CheckCircle2 size={18} /> {submitting ? 'Fulfilling Stock...' : 'Auto-Dispense Prescribed Stock'}
            </button>
          </div>
        )}
      </div>

      {lowStock.length > 0 && (
        <div style={styles.alertBanner}>
          <div style={styles.alertHeader}>
            <AlertTriangle size={20} color="var(--color-danger)" />
            <span style={{ fontWeight: 700, color: 'var(--color-danger)' }}>Critical Reorder Alerts ({lowStock.length})</span>
          </div>
          <p style={{ fontSize: '0.875rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
            The following items are below minimum thresholds: <strong>{lowStock.map(i => i.itemName).join(', ')}</strong>
          </p>
        </div>
      )}

      <div style={styles.contentGrid}>
        {/* Add Inventory Item */}
        <div className="card">
          <h3 style={styles.cardTitle}>
            <Plus size={20} color="var(--color-primary)" /> Register Store Supply / Medicine
          </h3>
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
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={itemForm.quantity}
                  onChange={(e) => setItemForm({ ...itemForm, quantity: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Reorder Limit</label>
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
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Registering...' : 'Add Store Entry'}
            </button>
          </form>
        </div>

        {/* Dispense Medicine Panel */}
        <div className="card">
          <h3 style={styles.cardTitle}>
            <PackageCheck size={20} color="var(--color-success)" /> Dispense Prescribed Stock
          </h3>
          <form onSubmit={handleDispense} style={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Inventory Supply</label>
              <select
                className="form-control"
                value={dispenseItem}
                onChange={(e) => setDispenseItem(e.target.value)}
                required
              >
                <option value="">-- Select Item --</option>
                {inventory.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.itemName} (Available: {item.quantity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dispense Units</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={dispenseQty}
                onChange={(e) => setDispenseQty(parseInt(e.target.value))}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">
              <PackageCheck size={18} /> Dispense Stock Units
            </button>
          </form>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={styles.cardTitle}>
            <Pill size={20} color="var(--color-primary)" /> Medicine Stock Directory
          </h3>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Units In Stock</th>
                <th>Reorder Limit</th>
                <th>Unit Price</th>
                <th>Expiry Date</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No inventory records found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const isLow = item.quantity <= item.reorderLevel;
                  const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
                  return (
                    <tr key={item._id}>
                      <td><span style={{ fontWeight: 700 }}>{item.itemName}</span></td>
                      <td>{item.category}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: isLow ? 'var(--color-danger)' : 'inherit' }}>
                          {item.quantity}
                        </span>
                        {isLow && <span className="badge badge-danger" style={{ marginLeft: '8px' }}>Low Stock</span>}
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
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  alertBanner: {
    padding: '16px 20px',
    borderRadius: 'var(--border-radius-md)',
    backgroundColor: 'var(--color-danger-light)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: '24px',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  formRow: {
    display: 'flex',
    gap: '14px',
  },
};

export default PharmacistDashboard;
