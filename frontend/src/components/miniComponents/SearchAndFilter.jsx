import React, { useEffect, useMemo, useState, Fragment } from "react";
import { Search, Filter, Check } from "lucide-react";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";

export default function SearchAndFilter({
  categories = [
    "All Categories",
    "Water Supply",
    "Education",
    "Healthcare",
    "Roads & Connectivity",
    "Electricity",
    "Sanitation",
  ],
  defaultSearch = "",
  defaultCategory = "All Categories",
  debounceMs = 250,
  onSearch,          // (text: string) => void
  onFilter,          // (category: string) => void
  onChange,          // ({ search, category }) => void
}) {
  const [searchText, setSearchText] = useState(defaultSearch);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);

  // Debounce search events so parent filtering doesn’t run on every keystroke
  useEffect(() => {
    const t = setTimeout(() => {
      onSearch && onSearch(searchText);
      onChange && onChange({ search: searchText, category: selectedCategory });
    }, debounceMs);
    return () => clearTimeout(t);
  }, [searchText, selectedCategory, debounceMs, onSearch, onChange]); // category also emitted immediately below [web:157]

  // Emit category immediately (no debounce) so taps/clicks feel snappy
  useEffect(() => {
    onFilter && onFilter(selectedCategory);
  }, [selectedCategory, onFilter]); // immediate category callback [web:106]

  // Ensure “All Categories” exists and is first
  const normalizedCategories = useMemo(() => {
    const set = new Set(categories);
    set.delete("All Categories");
    return ["All Categories", ...Array.from(set)];
  }, [categories]); // stabilized list to render [web:167]

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          aria-label="Search issues"
          placeholder="Search issues by title, description, or location..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full h-11 rounded-2xl border border-gray-200 bg-white pl-12 pr-4 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition"
        />
      </div>

      {/* Category Dropdown (Headless UI Listbox) */}
      <div className="relative w-full md:w-64">
        <Listbox value={selectedCategory} onChange={setSelectedCategory}>
          <div className="relative">
            <ListboxButton className="w-full h-11 rounded-2xl border border-gray-200 bg-white pl-4 pr-10 shadow-sm text-gray-800 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-300 transition">
              <span className="truncate">{selectedCategory}</span>
              <Filter className="w-4 h-4 text-gray-400" />
            </ListboxButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <ListboxOptions className="absolute z-20 mt-2 w-full rounded-2xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none p-1 max-h-72 overflow-y-auto">
                {normalizedCategories.map((cat) => (
                  <ListboxOption
                    key={cat}
                    value={cat}
                    className={({ active, selected }) =>
                      [
                        "flex items-center justify-between gap-3 rounded-xl px-3 py-2 cursor-pointer select-none",
                        active ? "bg-blue-50 text-blue-900" : "text-gray-900",
                        selected ? "font-medium" : "font-normal",
                      ].join(" ")
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className="truncate">{cat}</span>
                        {selected ? (
                          <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <span className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </Listbox>
      </div>
    </div>
  );
}
