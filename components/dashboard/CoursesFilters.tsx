import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

interface CoursesFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  sectionsList: string[];
  onAddCourse: () => void;
}

export default function CoursesFilters({
  searchQuery,
  setSearchQuery,
  selectedSection,
  setSelectedSection,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  sectionsList,
  onAddCourse
}: CoursesFiltersProps) {
  return (
    <>
     <div className="mb-6 flex justify-end">
        <button
          onClick={onAddCourse}
          className="flex items-center gap-2 px-6 py-3 bg-dashboardBg text-white rounded-lg hover:bg-[#059669] transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
          إضافة دورة جديدة
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" 
              />
              <input
                type="text"
                placeholder="بحث عن دورة بالعنوان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
              />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
            >
              <option value="all">كل الأقسام</option>
              {sectionsList.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
            >
              <option value="all">كل الأنواع</option>
              <option value="online">اونلاين</option>
              <option value="onsite">حضوري</option>
            </select>
          </div>

          <div className="w-full md:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#047857] focus:border-transparent"
            >
              <option value="all">كل الحالات</option>
              <option value="active">نشطة</option>
              <option value="completed">منتهية</option>
              <option value="upcoming">قادمة</option>
            </select>
          </div>
        </div>
      </div>

     
    </>
  );
}