import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

export default function DeleteRoleModal({ open, onClose, onConfirm }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="bg-white rounded-xl p-6 text-center">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-500 text-2xl mb-3"/>
        <h3 className="font-bold mb-2">حذف الدور</h3>
        <p>هل انت متأكد من حذف هذا الدور؟</p>

        <div className="flex gap-3 justify-center mt-4">
          <button onClick={onClose}>الغاء</button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded">حذف</button>
        </div>
      </div>
    </div>
  );
}
