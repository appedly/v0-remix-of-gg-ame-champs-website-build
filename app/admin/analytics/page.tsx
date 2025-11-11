"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { AdminNav } from "@/components/admin-nav"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  const router = useRouter()
  const [signupTrends, setSignupTrends] = useState([])
  const [conversionMetrics, setConversionMetrics] = useState({
    totalSignups: 0,
    emailVerified: 0,
    approved: 0,
    conversionRate: 0,
  })
  const [emailStats, setEmailStats] = useState({
    sent: 0,
    opened: 0,
    failed: 0,
    openRate: 0,
  })
  const [geoData, setGeoData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState("Admin")

  useEffect(() => {
    const fetchAnalytics = async () => {
      const adminSession = localStorage.getItem("admin_session")

      if (!adminSession) {
        router.push("/admin/login")
        return
      }

      const supabase = createClient()

      try {
        const [usersData, analyticsData, emailData, locationData] = await Promise.all([
          supabase.from("users").select("created_at, approved, email"),
          supabase.from("analytics_events").select("event_type, created_at").order("created_at", { ascending: true }),
          supabase.from("email_events").select("email_type, sent_at, opened_at, failed_at"),
          supabase.from("user_locations").select("country"),
        ])

        // Process signup trends
        if (analyticsData.data) {
          const signupsByDay = {}
          analyticsData.data.forEach((event) => {
            if (event.event_type === "signup") {
              const date = new Date(event.created_at).toLocaleDateString()
              signupsByDay[date] = (signupsByDay[date] || 0) + 1
            }
          })

          const trendData = Object.entries(signupsByDay).map(([date, count]) => ({
            date,
            signups: count,
          }))

          setSignupTrends(trendData)
        }

        // Process conversion metrics
        if (usersData.data) {
          const total = usersData.data.length
          const verified = usersData.data.filter((u) => u.created_at).length
          const approved = usersData.data.filter((u) => u.approved).length

          setConversionMetrics({
            totalSignups: total,
            emailVerified: verified,
            approved: approved,
            conversionRate: total > 0 ? ((approved / total) * 100).toFixed(2) : 0,
          })
        }

        // Process email stats
        if (emailData.data) {
          const sent = emailData.data.length
          const opened = emailData.data.filter((e) => e.opened_at).length
          const failed = emailData.data.filter((e) => e.failed_at).length

          setEmailStats({
            sent,
            opened,
            failed,
            openRate: sent > 0 ? ((opened / sent) * 100).toFixed(2) : 0,
          })
        }

        // Process geographic distribution
        if (locationData.data) {
          const countryCount = {}
          locationData.data.forEach((loc) => {
            if (loc.country) {
              countryCount[loc.country] = (countryCount[loc.country] || 0) + 1
            }
          })

          const geoChart = Object.entries(countryCount)
            .map(([country, count]) => ({
              country,
              users: count,
            }))
            .sort((a, b) => b.users - a.users)
            .slice(0, 10)

          setGeoData(geoChart)
        }

        setUserName("Admin")
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1020] flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    )
  }

  const conversionData = [
    { name: "Signups", value: conversionMetrics.totalSignups, fill: "#4A6CFF" },
    { name: "Verified", value: conversionMetrics.emailVerified, fill: "#00C2FF" },
    { name: "Approved", value: conversionMetrics.approved, fill: "#10B981" },
  ]

  return (
    <div className="min-h-screen bg-[#0B1020]">
      <AdminNav userName={userName} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics & Insights</h1>
        <p className="text-white/60 mb-8">Monitor platform growth, engagement, and conversion metrics</p>

        {/* Conversion Metrics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#1a2332] border-[#2a3342]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Total Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{conversionMetrics.totalSignups}</div>
              <p className="text-xs text-white/40 mt-1">All-time registrations</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3342]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Email Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#00C2FF]">{conversionMetrics.emailVerified}</div>
              <p className="text-xs text-white/40 mt-1">Accounts verified</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3342]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Approved Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#10B981]">{conversionMetrics.approved}</div>
              <p className="text-xs text-white/40 mt-1">Dashboard access granted</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2332] border-[#2a3342]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/60">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#FDB022]">{conversionMetrics.conversionRate}%</div>
              <p className="text-xs text-white/40 mt-1">Signups to approved</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Signup Trend Chart */}
          <Card className="bg-[#1a2332] border-[#2a3342]">
            <CardHeader>
              <CardTitle className="text-white">Signup Trends</CardTitle>
              <CardDescription>Daily signups over time</CardDescription>
            </CardHeader>
            <CardContent>
              {signupTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={signupTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3342" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: "#1a2332", border: "1px solid #2a3342" }} />
                    <Line type="monotone" dataKey="signups" stroke="#4A6CFF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/60">No data available</div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card className="bg-[#1a2332] border-[#2a3342]">
            <CardHeader>
              <CardTitle className="text-white">Conversion Funnel</CardTitle>
              <CardDescription>Signups to approved users</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {conversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1a2332", border: "1px solid #2a3342" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Email Delivery Stats */}
          <Card className="bg-[#1a2332] border-[#2a3342]">
            <CardHeader>
              <CardTitle className="text-white">Email Delivery Stats</CardTitle>
              <CardDescription>Email performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Emails Sent</span>
                  <span className="text-xl font-bold text-white">{emailStats.sent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Opened</span>
                  <span className="text-xl font-bold text-[#00C2FF]">{emailStats.opened}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Failed</span>
                  <span className="text-xl font-bold text-red-400">{emailStats.failed}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[#2a3342]">
                  <span className="text-white/60">Open Rate</span>
                  <span className="text-xl font-bold text-[#10B981]">{emailStats.openRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card className="bg-[#1a2332] border-[#2a3342]">
            <CardHeader>
              <CardTitle className="text-white">Geographic Distribution</CardTitle>
              <CardDescription>Top 10 countries by user count</CardDescription>
            </CardHeader>
            <CardContent>
              {geoData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={geoData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a3342" />
                    <XAxis dataKey="country" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{ backgroundColor: "#1a2332", border: "1px solid #2a3342" }} />
                    <Bar dataKey="users" fill="#4A6CFF" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/60">
                  No geographic data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
