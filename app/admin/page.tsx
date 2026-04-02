export default function AdminDashboard() {
  const stats = [
    { label: 'Total Revenue', value: '₹45,000', change: '+12%' },
    { label: 'Active Rentals', value: '8', change: 'Bhopal Region' },
    { label: 'Pending Requests', value: '3', change: 'Urgent' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Business Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
            <span className="text-emerald-400 text-xs mt-2 block">{stat.change}</span>
          </div>
        ))}
      </div>
      
      {/* You can add a Chart here later */}
      <div className="mt-10 p-10 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
        <p className="text-gray-500">Booking Analytics Chart Coming Soon...</p>
      </div>
    </div>
  );
}