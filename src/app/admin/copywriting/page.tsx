'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Edit2, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { ConfirmDialog, useConfirmDialog } from '@/components/ui/ConfirmDialog';

interface CopywritingEntry {
  id: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'json' | 'array';
  order_index: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GroupedCopywriting {
  [section: string]: CopywritingEntry[];
}

export default function CopywritingManager() {
  const router = useRouter();
  const [copywriting, setCopywriting] = useState<GroupedCopywriting>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CopywritingEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isrStatus, setIsrStatus] = useState<string | null>(null);
  const dialog = useConfirmDialog();

  const [formData, setFormData] = useState({
    section: '',
    key: '',
    value: '',
    type: 'text' as 'text' | 'json' | 'array',
    order_index: 0,
    isActive: true
  });

  useEffect(() => {
    loadCopywriting();
  }, []);

  const loadCopywriting = async () => {
    try {
      const response = await fetch('/api/copywriting?admin=true');
      if (response.ok) {
        const data = await response.json();
        setCopywriting(data.data);
      }
    } catch (error) {
      console.error('Error loading copywriting:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerISR = async (message: string = 'Content updated successfully') => {
    setIsrStatus('Triggering ISR revalidation...');
    try {
      const response = await fetch('/api/isr-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invalidateAll: true,
          message
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsrStatus(`✅ ${result.message}`);
      } else {
        setIsrStatus('❌ ISR revalidation failed');
      }
    } catch (error) {
      console.error('ISR trigger error:', error);
      setIsrStatus('❌ ISR revalidation failed');
    } finally {
      setTimeout(() => setIsrStatus(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingEntry ? '/api/copywriting' : '/api/copywriting';
      const method = editingEntry ? 'PUT' : 'POST';
      
      const payload = editingEntry 
        ? { ...formData, id: editingEntry.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadCopywriting();
        resetForm();
        await triggerISR(`Copywriting ${editingEntry ? 'updated' : 'created'} successfully!`);
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving copywriting:', error);
      alert('Failed to save copywriting');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (entry: CopywritingEntry) => {
    dialog.confirm({
      title: 'Delete Copywriting Entry',
      message: `Are you sure you want to delete "${entry.key}" from the "${entry.section}" section? This action cannot be undone and will trigger immediate page revalidation.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: async () => {
        const response = await fetch('/api/copywriting', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: entry.id }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete');
        }

        await loadCopywriting();
        await triggerISR(`Copywriting entry "${entry.key}" deleted successfully!`);
      }
    });
  };

  const handleEdit = (entry: CopywritingEntry) => {
    setEditingEntry(entry);
    setFormData({
      section: entry.section,
      key: entry.key,
      value: entry.value,
      type: entry.type,
      order_index: entry.order_index,
      isActive: entry.isActive
    });
    setShowForm(true);
  };

  const handleToggleActive = (entry: CopywritingEntry) => {
    dialog.confirm({
      title: `${entry.isActive ? 'Deactivate' : 'Activate'} Copywriting Entry`,
      message: `Are you sure you want to ${entry.isActive ? 'deactivate' : 'activate'} "${entry.key}"? This will ${entry.isActive ? 'hide' : 'show'} this content on the public site and trigger page revalidation.`,
      confirmText: entry.isActive ? 'Deactivate' : 'Activate',
      cancelText: 'Cancel',
      type: 'warning',
      onConfirm: async () => {
        const response = await fetch('/api/copywriting', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: entry.id, isActive: !entry.isActive }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update status');
        }

        await loadCopywriting();
        await triggerISR(`Copywriting entry "${entry.key}" ${entry.isActive ? 'deactivated' : 'activated'} successfully!`);
      }
    });
  };

  const resetForm = () => {
    setFormData({
      section: '',
      key: '',
      value: '',
      type: 'text',
      order_index: 0,
      isActive: true
    });
    setEditingEntry(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading copywriting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Copywriting Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => triggerISR('Manual ISR revalidation triggered')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                disabled={!!isrStatus}
              >
                <RefreshCw className={`w-4 h-4 ${isrStatus ? 'animate-spin' : ''}`} />
                Revalidate
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ISR Status */}
      {isrStatus && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-blue-800 text-sm">{isrStatus}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editingEntry ? 'Edit Entry' : 'Add New Entry'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key
                  </label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="text">Text</option>
                  <option value="json">JSON</option>
                  <option value="array">Array</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value
                </label>
                <textarea
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Index
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingEntry ? 'Update' : 'Create')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Copywriting Entries */}
        <div className="space-y-8">
          {Object.entries(copywriting).map(([section, entries]) => (
            <div key={section} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{section}</h3>
                <p className="text-sm text-gray-500">{entries.length} entries</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{entry.key}</h4>
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {entry.type}
                          </span>
                          {!entry.isActive && (
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>
                        <pre className="text-sm text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(JSON.parse(entry.value || '{}'), null, 2)}
                        </pre>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(entry)}
                          className="p-2 text-gray-500 hover:text-gray-700"
                          title={entry.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {entry.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(entry)}
                          className="p-2 text-gray-500 hover:text-blue-600"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry)}
                          className="p-2 text-gray-500 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={dialog.dialog.isOpen}
        onClose={dialog.close}
        onConfirm={dialog.dialog.onConfirm}
        title={dialog.dialog.title}
        message={dialog.dialog.message}
        confirmText={dialog.dialog.confirmText}
        cancelText={dialog.dialog.cancelText}
        type={dialog.dialog.type}
      />
    </div>
  );
}
