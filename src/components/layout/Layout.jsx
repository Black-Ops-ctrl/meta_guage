import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children, activePage, onNavigate, scopeLabel, onScopeChange, dateLabel, onDateChange }) {
  const isProjects = activePage === "projects";

  return (
    <div className={`min-h-screen ${isProjects ? "bg-gray-50" : "bg-gray-50"}`}>
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <div className="ml-48 flex flex-col min-h-screen">
        <Header
          scopeLabel={scopeLabel}
          onScopeChange={onScopeChange}
          dateLabel={dateLabel}
          onDateChange={onDateChange}
        />
        <main className={isProjects ? "flex-1" : "p-6 flex-1"}>
          {children}
        </main>
      </div>
    </div>
  );
}
