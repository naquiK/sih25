import { useMemo, useState, Fragment, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Description } from "@headlessui/react";
import { X, MapPin, Calendar } from "lucide-react";
import SearchAndFilter from "./SearchAndFilter";

export default function ViewMoreModal({
  open,
  onClose,
  title,
  description,
  issues,
  statusColors,
}) {
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      root.classList.add("modal-open");         // toggle a flag on <html>
      document.body.style.overflow = "hidden";  // lock background scroll
    } else {
      root.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      root.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [open]);
  // Modal-local filter state (independent from page)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  // Derive categories from the incoming issues list
  const categories = useMemo(() => {
    const set = new Set(issues.map(i => i.category).filter(Boolean));
    return ["All Categories", ...Array.from(set)];
  }, [issues]);

  // Filter the provided issues with modal's search/category
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return issues.filter(i => {
      const matchesText =
        !q ||
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.desc && i.desc.toLowerCase().includes(q)) ||
        (i.location && i.location.toLowerCase().includes(q)) ||
        (i.id && i.id.toLowerCase().includes(q));
      const matchesCat = category === "All Categories" || i.category === category;
      return matchesText && matchesCat;
    });
  }, [issues, search, category]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          {description ? (
            <Description className="text-sm text-gray-500">{description}</Description>
          ) : null}

          {/* Search + Filter inside modal */}
          <div className="mt-4">
            <SearchAndFilter
              categories={categories}
              onSearch={setSearch}
              onFilter={setCategory}
              onChange={({ search, category }) => {
                setSearch(search);
                setCategory(category);
              }}
            />
          </div>

          {/* Results */}
          <div className="mt-4 max-h-[70vh] overflow-y-auto space-y-3">
            {filtered.map((issue) => (
              <div key={issue.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-blue-600">{issue.id}</span>
                    <h3 className="font-semibold text-gray-800">{issue.title}</h3>
                    <p className="text-sm text-gray-600">{issue.desc}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{issue.location}</span>
                      <span>•</span>
                      <span>{issue.category}</span>
                      <span>•</span>
                      <Calendar className="w-4 h-4" />
                      <span>Reported: {issue.updated}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>
                    {issue.status}
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm text-gray-500 px-1 py-3">No reports match the current filters.</div>
            )}
          </div>

          <div className="mt-4 text-right">
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
