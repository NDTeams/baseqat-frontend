import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, faShieldHalved, faTrash, faCheckCircle,
  faUserShield, faUserTie, faUserPen, faEye
} from '@fortawesome/free-solid-svg-icons';

interface Role {
  id: string | number;
  name: string;
  nameEn: string;
  description: string;
  permissions: string[];
}

export default function RoleCard({ role, onEdit, onDelete, onPrivileges }: any) {

  const getRoleIcon = (roleNameEn: string) => {
    switch (roleNameEn.toLowerCase()) {
      case 'admin': return { icon: faUserShield, color: 'from-red-500 to-red-600' };
      case 'manager': return { icon: faUserTie, color: 'from-blue-500 to-blue-600' };
      case 'editor': return { icon: faUserPen, color: 'from-green-500 to-green-600' };
      default: return { icon: faEye, color: 'from-gray-500 to-gray-600' };
    }
  };

  const { icon, color } = getRoleIcon(role.nameEn);

  return (
    <div className="role-card bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary transform hover:-translate-y-1">
      <div className="role-header p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`role-icon w-14 h-14 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${color}`}>
            <FontAwesomeIcon icon={icon} className="text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{role.name}</h3>
            <p className="text-sm text-gray-500">{role.nameEn}</p>
          </div>
        </div>
      </div>

      <div className="role-body p-6">
        <div className="permissions-group">
          <div className="permissions-label text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">الصلاحيات</div>
          <div className="permissions-list flex flex-wrap gap-2">
            {role.permissions.slice(0,4).map((perm:any,idx:number)=>(
              <span key={idx} className="permission-badge inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                <FontAwesomeIcon icon={faCheckCircle} className="text-[10px]" />
                {perm}
              </span>
            ))}
            {role.permissions.length>4 && (
              <span className="permission-badge inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium">
                +{role.permissions.length-4}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="role-actions p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50 rounded-b-2xl">
        <button onClick={()=>onEdit(role)} className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex gap-2">
          <FontAwesomeIcon icon={faEdit}/> تعديل
        </button>
        <button onClick={()=>onPrivileges(role)} className="px-4 py-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 flex gap-2">
          <FontAwesomeIcon icon={faShieldHalved}/> الصلاحيات
        </button>
        <button onClick={()=>onDelete(role)} className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex gap-2">
          <FontAwesomeIcon icon={faTrash}/> حذف
        </button>
      </div>
    </div>
  );
}
