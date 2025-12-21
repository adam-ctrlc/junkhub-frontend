import { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  DollarSign,
  Package,
  Bell,
  BarChart2,
  Loader2,
} from "lucide-react";
import Select from "../../../components/Select";
import { useOwnerStats, useOwnerActivity } from "../../../lib/hooks";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const [period, setPeriod] = useState("7d");
  const { stats, isLoading: statsLoading } = useOwnerStats(period);
  const { activity, isLoading: activityLoading } = useOwnerActivity(10);

  const statCards = [
    {
      label: "Total Sales",
      value: `₱${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Pending Offers",
      value: stats.pendingOffers.toString(),
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Active Products",
      value: stats.activeProducts.toString(),
      icon: Package,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
  ];

  const formatTime = (time) => {
    try {
      return formatDistanceToNow(new Date(time), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back! Here's what's happening with your shop.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Shop Active
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                {statsLoading && (
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                )}
              </div>
              <h3 className="text-gray-500 text-sm font-medium">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statsLoading ? "..." : stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area - Stats Overview */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Revenue Overview
              </h2>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="1y">This Year</option>
              </Select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400">
              <div className="text-center">
                <BarChart2 size={48} className="mx-auto mb-2 opacity-50" />
                <p className="font-semibold">
                  Total Sales: ₱{stats.totalSales.toLocaleString()}
                </p>
                <p className="text-sm mt-1">
                  {stats.totalOrders} orders in selected period
                </p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Recent Activity
            </h2>
            {activityLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : activity.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Bell size={32} className="mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activity.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        item.type === "order"
                          ? "bg-blue-100 text-blue-600"
                          : item.type === "offer"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.type === "order" ? (
                        <ShoppingBag size={18} />
                      ) : item.type === "offer" ? (
                        <DollarSign size={18} />
                      ) : (
                        <Bell size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "completed" ||
                                item.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(item.time)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
