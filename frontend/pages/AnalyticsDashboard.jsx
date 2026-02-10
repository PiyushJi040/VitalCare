import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BarChart3, TrendingUp, Users, Calendar, Clock, MapPin, Activity, Heart, Eye, Stethoscope } from "lucide-react";
import offlineStorage from "../src/utils/offlineStorage";

const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("week");
  const [analytics, setAnalytics] = useState({
    totalConsultations: 1247,
    activePatients: 892,
    avgConsultationTime: 18,
    patientSatisfaction: 4.7,
    topConditions: [
      { name: "Common Cold", count: 156, percentage: 25 },
      { name: "Hypertension", count: 134, percentage: 21 },
      { name: "Diabetes", count: 98, percentage: 16 },
      { name: "Skin Conditions", count: 87, percentage: 14 },
      { name: "Eye Problems", count: 72, percentage: 12 }
    ],
    consultationsByHour: [
      { hour: "9 AM", count: 45 },
      { hour: "10 AM", count: 67 },
      { hour: "11 AM", count: 89 },
      { hour: "12 PM", count: 78 },
      { hour: "1 PM", count: 56 },
      { hour: "2 PM", count: 92 },
      { hour: "3 PM", count: 103 },
      { hour: "4 PM", count: 87 },
      { hour: "5 PM", count: 65 }
    ],
    geographicData: [
      { region: "Punjab", patients: 456, consultations: 789 },
      { region: "Haryana", patients: 234, consultations: 456 },
      { region: "Delhi", patients: 123, consultations: 234 },
      { region: "Rajasthan", patients: 89, consultations: 167 }
    ]
  });

  useEffect(() => {
    // Cache analytics data offline
    offlineStorage.setItem('analytics_data', analytics);
  }, [analytics]);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`bg-${color}-100 p-3 rounded-full`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const maxConsultations = Math.max(...analytics.consultationsByHour.map(h => h.count));

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center">
                <BarChart3 className="h-10 w-10 mr-3 text-blue-600" />
                Telemedicine Analytics
              </h1>
              <p className="text-gray-400 mt-2">Comprehensive insights into healthcare delivery</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Consultations"
            value={analytics.totalConsultations.toLocaleString()}
            icon={Stethoscope}
            color="blue"
            subtitle="↑ 12% from last week"
          />
          <StatCard
            title="Active Patients"
            value={analytics.activePatients.toLocaleString()}
            icon={Users}
            color="green"
            subtitle="↑ 8% from last week"
          />
          <StatCard
            title="Avg Consultation Time"
            value={`${analytics.avgConsultationTime} min`}
            icon={Clock}
            color="purple"
            subtitle="↓ 2 min from last week"
          />
          <StatCard
            title="Patient Satisfaction"
            value={`${analytics.patientSatisfaction}/5`}
            icon={Heart}
            color="red"
            subtitle="↑ 0.2 from last week"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Consultations by Hour */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Consultations by Hour
            </h2>
            <div className="space-y-3">
              {analytics.consultationsByHour.map((item) => (
                <div key={item.hour} className="flex items-center">
                  <div className="w-16 text-sm text-gray-400">{item.hour}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / maxConsultations) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-white">{item.count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Conditions */}
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Top Medical Conditions
            </h2>
            <div className="space-y-4">
              {analytics.topConditions.map((condition, index) => (
                <div key={condition.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{condition.name}</p>
                      <p className="text-sm text-gray-400">{condition.count} cases</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{condition.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-purple-600" />
            Geographic Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analytics.geographicData.map((region) => (
              <div key={region.region} className="text-center">
                <div className="bg-purple-100 rounded-lg p-6 mb-3">
                  <h3 className="font-bold text-lg text-purple-800">{region.region}</h3>
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{region.patients}</p>
                      <p className="text-sm text-gray-400">Active Patients</p>
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-purple-500">{region.consultations}</p>
                      <p className="text-sm text-gray-400">Total Consultations</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              System Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime</span>
                <span className="font-semibold text-green-600">99.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Avg Response Time</span>
                <span className="font-semibold">1.2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Error Rate</span>
                <span className="font-semibold text-red-600">0.1%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Appointment Metrics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Scheduled Today</span>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completed</span>
                <span className="font-semibold text-green-600">98</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">No-shows</span>
                <span className="font-semibold text-red-600">8</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              User Engagement
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Active Users</span>
                <span className="font-semibold">2,456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">New Registrations</span>
                <span className="font-semibold text-green-600">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Retention Rate</span>
                <span className="font-semibold">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;