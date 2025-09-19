import { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDown, Search, Filter } from "lucide-react";

const categories = ["All Categories", "Infrastructure", "Utilities", "Sanitation", "Safety"];

export default function SearchAndFilter({ onSearch, onCategoryChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(categories[0]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleCategoryChange = (value) => {
    setSelected(value);
    if (onCategoryChange) onCategoryChange(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-green-600" />
        <h3 className="font-medium text-gray-700">Search & Filter</h3>
      </div>

      {/* Search + Dropdown */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="flex items-center w-full bg-gray-50 px-3 py-2 rounded-md border focus-within:ring-2 focus-within:ring-green-500">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search issues by description or location..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        {/* Dropdown */}
        <div className="w-48">
          <Listbox value={selected} onChange={handleCategoryChange}>
            <div className="relative">
              {/* Button */}
              <Listbox.Button className="relative w-full cursor-default rounded-md border bg-white py-2 pl-3 pr-8 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                <span className="block truncate">{selected}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </span>
              </Listbox.Button>

              {/* Options */}
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                  {categories.map((category, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-4 ${
                          active ? "bg-green-100 text-green-700" : "text-gray-900"
                        }`
                      }
                      value={category}
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                          {category}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  );
}
