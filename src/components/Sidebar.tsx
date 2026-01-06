"use client";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-80 p-6 border-b md:border-b-0 md:border-r border-white/10">
        {children}
      </aside>
    </div>
  );
}
