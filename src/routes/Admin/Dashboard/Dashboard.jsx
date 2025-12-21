import { useState, useEffect } from "react";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  AlertCircle,
  Loader2,
  BarChart3,
} from "lucide-react";
import Select from "../../../components/Select";
import { getAdminStats, getOwners } from "../../../lib/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, ownersRes] = await Promise.all([
          getAdminStats(),
          getOwners(5, 0), // Get latest 5 owners for "Need Attention" section
        ]);

        setStats(statsRes.stats);
        setPendingOwners(ownersRes.owners || []);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || "0";
  };

  // Generate chart data from stats - creates a simple bar representation
  const generateChartData = () => {
    if (!stats) return [];
    return [
      { name: "Users", value: stats.users || 0, fill: "#2563EB" },
      { name: "Owners", value: stats.owners || 0, fill: "#EA580C" },
      { name: "Products", value: stats.products || 0, fill: "#16A34A" },
      { name: "Orders", value: stats.orders || 0, fill: "#9333EA" },
    ];
  };

  const statCards = [
    {
      label: "Total Users",
      value: formatNumber(stats?.users),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Owners",
      value: formatNumber(stats?.owners),
      icon: Store,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Active Products",
      value: formatNumber(stats?.products),
      icon: Package,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Orders",
      value: formatNumber(stats?.orders),
      icon: ShoppingCart,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-lg">
              Failed to load dashboard
            </p>
            <p className="text-gray-500">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
        <Select>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>All Time</option>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-blue-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">System Overview</h2>
          </div>
          <div className="space-y-4">
            {generateChartData().map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="font-bold text-gray-900">
                    {formatNumber(item.value)}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (item.value /
                          Math.max(
                            ...generateChartData().map((d) => d.value),
                            1
                          )) *
                          100,
                        100
                      )}%`,
                      backgroundColor: item.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats Summary */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber((stats?.users || 0) + (stats?.owners || 0))}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Total Accounts
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">
                {formatNumber((stats?.products || 0) + (stats?.orders || 0))}
              </p>
              <p className="text-xs text-gray-500 font-medium">
                Total Activity
              </p>
            </div>
          </div>
        </div>

        {/* Recent Owners */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Recent Owners
          </h2>
          <div className="space-y-4">
            {pendingOwners.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">
                No recent owners
              </p>
            ) : (
              pendingOwners.slice(0, 5).map((owner) => (
                <div
                  key={owner.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100 hover:border-blue-200 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {owner.businessName?.slice(0, 2).toUpperCase() || "OW"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {owner.businessName || "Unnamed Shop"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {owner.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      {stats?.revenue > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl text-white">
          <h3 className="text-sm font-medium text-blue-100 mb-1">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold">₱{formatNumber(stats.revenue)}</p>
        </div>
      )}
    </div>
  );
}
