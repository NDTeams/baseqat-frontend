import AddUserSection from "@/components/(dashboard)/addUser-section"
export default function Users() {
    return(
        <div className="space-y-6">
              <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">المستخدمين</h1>
                </div>
                <AddUserSection />

        </div>
    )
}