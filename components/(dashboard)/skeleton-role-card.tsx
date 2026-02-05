export const SkeletonRoleCard = () => (
  <div className="role-card bg-white rounded-2xl shadow-sm border-2 border-transparent animate-pulse">
    <div className="role-header p-6 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-4 w-full">
        <div className="w-14 h-14 rounded-xl bg-gray-200"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
    <div className="role-body p-6">
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="permissions-group">
        <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div className="flex flex-wrap gap-2">
          {[1,2,3,4].map(i=>(
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
    <div className="role-actions p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/50 rounded-b-2xl">
      <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
      <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);
