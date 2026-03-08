'use client';
import { useInvoiceStore } from '@/store/invoiceStore';
import { formatCurrency } from '@/utils/format';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { InvoiceItem } from '@/types/invoice';

export function ItemTable() {
  const { invoice, addItem, updateItem, removeItem, reorderItems } = useInvoiceStore();
  const { items, currency, customization } = invoice;
  const cols = customization.columnNames;

  // Simple drag-to-reorder state
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  function handleDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setOverIdx(idx);
  }

  function handleDrop(idx: number) {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    const newItems = [...items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, moved);
    reorderItems(newItems);
    setDragIdx(null);
    setOverIdx(null);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <span className="text-indigo-500">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </span>
          Line Items
        </h3>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="w-6 px-1 py-3"></th>
              <th className="px-2 py-3 text-left font-semibold">{cols.description}</th>
              <th className="px-2 py-3 text-right font-semibold w-16">{cols.quantity}</th>
              <th className="px-2 py-3 text-right font-semibold w-24">{cols.rate}</th>
              <th className="px-2 py-3 text-right font-semibold w-24">{cols.amount}</th>
              <th className="px-1 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <ItemRow
                key={item.id}
                item={item}
                idx={idx}
                currency={currency}
                isDragging={dragIdx === idx}
                isOver={overIdx === idx}
                onUpdate={(data) => updateItem(item.id, data)}
                onRemove={() => removeItem(item.id)}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDrop={() => handleDrop(idx)}
                onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
              />
            ))}            
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400 text-sm">
                  No items added yet. Click &quot;Add Item&quot; to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Subtotal row */}
      {items.length > 0 && (
        <div className="flex justify-end px-5 py-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500 font-medium">Items Subtotal:</span>
            <span className="font-bold text-slate-800 min-w-[100px] text-right">
              {formatCurrency(items.reduce((s, i) => s + i.subtotal, 0), currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface ItemRowProps {
  item: InvoiceItem;
  idx: number;
  currency: string;
  isDragging: boolean;
  isOver: boolean;
  onUpdate: (data: Partial<InvoiceItem>) => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

function ItemRow({ item, idx, currency, isDragging, isOver, onUpdate, onRemove, onDragStart, onDragOver, onDrop, onDragEnd }: ItemRowProps) {
  return (
    <tr
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`border-b border-slate-100 transition-all ${isDragging ? 'opacity-40' : ''} ${isOver ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
    >
      <td className="px-1 py-2 cursor-grab text-slate-300 hover:text-slate-500">
        <GripVertical size={13} />
      </td>
      <td className="px-2 py-2">
        <input
          type="text"
          value={item.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Item description..."
          className="w-full text-sm bg-transparent border border-transparent focus:border-slate-200 focus:bg-white px-2 py-1 rounded-md outline-none transition-all"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={0}
          value={item.quantity}
          onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 0 })}
          className="w-full text-sm text-right bg-transparent border border-transparent focus:border-slate-200 focus:bg-white px-1 py-1 rounded-md outline-none transition-all"
        />
      </td>
      <td className="px-2 py-2">
        <input
          type="number"
          min={0}
          value={item.rate}
          onChange={(e) => onUpdate({ rate: parseFloat(e.target.value) || 0 })}
          className="w-full text-sm text-right bg-transparent border border-transparent focus:border-slate-200 focus:bg-white px-1 py-1 rounded-md outline-none transition-all"
        />
      </td>
      <td className="px-2 py-2 text-right font-medium text-slate-700 text-sm whitespace-nowrap">
        {formatCurrency(item.subtotal, currency)}
      </td>
      <td className="px-1 py-2">
        <button
          type="button"
          onClick={onRemove}
          className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
