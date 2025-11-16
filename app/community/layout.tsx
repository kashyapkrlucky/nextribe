import {
  FilterIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "lucide-react";
import React from "react";

function CommunityLayout({ children }: { children: React.ReactNode }) {
  const user = {
    fullName: "John Doe",
  };
  return (
    <main className={`w-full p-4 h-full`}>
      <div className="w-full flex flex-col lg:flex-row gap-4">
        <aside className="flex flex-col lg:w-1/5 gap-4">
          <div className={`flex flex-col gap-1 rounded-xl`}>
            <div
              className={`flex flex-col items-center gap-2 p-4 rounded-t-xl bg-blue-100`}
            >
              {/* <Avatar user={user} classes={"w-20 h-20 bg-white shadow-md border-2"} /> */}
              <p className={`text-lg`}>{user?.fullName}</p>
            </div>
            <div className="flex flex-col gap-4 p-3">
              <div className={`flex flex-row gap-2 items-center`}>
                <ShieldCheckIcon className="w-6 h-6" />
                <p className="text-sm">My Community (0)</p>
              </div>
            </div>
          </div>
        </aside>
        <section className="flex flex-col lg:w-3/5 gap-4">
          <div className="flex flex-row justify-between gap-4 items-center">
            <h2 className={`text-xl font-semibold`}>All Communities</h2>
            <div className="flex flex-row items-center gap-4">
              <button
                className={`flex flex-row items-center gap-2 rounded-lg px-4 py-2`}
              >
                <PlusIcon className="w-4 h-4 text-white" />
                <span>Create</span>
              </button>
              <button className="bg-white rounded-lg border px-2 py-1">
                <FilterIcon className="w-8 h-8 text-slate-600" />
              </button>
            </div>
          </div>
          {/* <CommunityList /> */}
          {children}
        </section>
        <aside className="flex flex-col lg:w-1/5 gap-4">
          {/* <FeaturedCommunities  /> */}
        </aside>
      </div>
    </main>
  );
}

export default CommunityLayout;
