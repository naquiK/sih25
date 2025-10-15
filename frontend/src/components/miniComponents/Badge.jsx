export default function Badge({ value, type }) {
  // Color Maps
  const statusColors = {
    Pending: "bg-red-100 text-red-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Resolved: "bg-green-100 text-green-700",
  };

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  const urgencyColors = {
    Critical: "bg-red-100 text-red-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  // Pick right color set
  const colors =
    type === "status"
      ? statusColors
      : type === "priority"
      ? priorityColors
      : type === "urgency"
      ? urgencyColors
      : {};

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
        colors[value] || "bg-gray-100 text-gray-700"
      }`}
    >
      {value}
    </span>
  );
}
