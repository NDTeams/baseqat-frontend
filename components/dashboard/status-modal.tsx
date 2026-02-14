'use client';
import React, { useState, useEffect } from 'react';

interface StatusModalProps {
  isOpen: boolean;
  userId: string;
  currentStatus: 'active' | 'inactive';
  onClose: () => void;
  onSave: (userId: string, status: 'active' | 'inactive') => void;
}

export default function StatusModal({ isOpen, userId, currentStatus, onClose, onSave }: StatusModalProps) {
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-96">
        <h2 className="text-xl font-bold mb-4">تغيير حالة المستخدم</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')} className="w-full border px-3 py-2 rounded mb-4">
          <option value="active">نشط</option>
          <option value="inactive">غير نشط</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">إلغاء</button>
          <button onClick={() => onSave(userId, status)} className="px-4 py-2 bg-blue-500 text-white rounded">حفظ</button>
        </div>
      </div>
    </div>
  );
}
