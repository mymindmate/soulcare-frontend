import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Clock, Activity, CalendarDays, BarChart2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Define Assessment type from the schema
interface Assessment {
  id: number;
  userId: number;
  score: number;
  stressLevel: 'low' | 'medium' | 'high';
  createdAt: string;
}

function formatDate(dateString: string) {
  return format(parseISO(dateString), 'MMM dd, yyyy');
}

function formatTime(dateString: string) {
  return format(parseISO(dateString), 'hh:mm a');
}

function getStressLevelScore(level: string): number {
  switch (level) {
    case 'low': return 1;
    case 'medium': return 2;
    case 'high': return 3;
    default: return 0;
  }
}

const Dashboard = () => {
  const { user, isAuthenticated, isProfileComplete } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Redirect to auth page if not authenticated or profile not complete
  useEffect(() => {
    if (!isAuthenticated || !isProfileComplete) {
      setLocation("/auth");
    }
  }, [isAuthenticated, isProfileComplete, setLocation]);

  // Fetch user assessments
  const { data: assessments, isLoading } = useQuery({
    queryKey: ['/api/assessments/user', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      try {
        const data = await apiRequest<Assessment[]>('GET', `/api/assessments/user/${user?.id}`);
        return data || [];
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
        return [];
      }
    }
  });

  // Process assessment data for charts
  const processedAssessments = assessments?.map(assessment => ({
    id: assessment.id,
    date: formatDate(assessment.createdAt),
    time: formatTime(assessment.createdAt),
    score: assessment.score,
    level: assessment.stressLevel,
    levelScore: getStressLevelScore(assessment.stressLevel),
    timestamp: new Date(assessment.createdAt).getTime(),
    dayOfWeek: format(parseISO(assessment.createdAt), 'EEEE'),
    hourOfDay: parseInt(format(parseISO(assessment.createdAt), 'H')),
  }));

  // Sort by date 
  const sortedAssessments = [...(processedAssessments || [])].sort((a, b) => a.timestamp - b.timestamp);

  // Group by day of week for weekly report
  const dayOfWeekData = processedAssessments?.reduce((acc, curr) => {
    const existingDay = acc.find(item => item.day === curr.dayOfWeek);
    if (existingDay) {
      existingDay.count += 1;
      existingDay.totalScore += curr.levelScore;
      existingDay.avgScore = existingDay.totalScore / existingDay.count;
    } else {
      acc.push({
        day: curr.dayOfWeek,
        count: 1,
        totalScore: curr.levelScore,
        avgScore: curr.levelScore
      });
    }
    return acc;
  }, [] as { day: string; count: number; totalScore: number; avgScore: number }[]) || [];

  // Group by hour of day for time-based report
  const hourOfDayData = processedAssessments?.reduce((acc, curr) => {
    // Group hours into time blocks 
    let timeBlock;
    if (curr.hourOfDay >= 5 && curr.hourOfDay < 12) timeBlock = "Morning (5AM-12PM)";
    else if (curr.hourOfDay >= 12 && curr.hourOfDay < 17) timeBlock = "Afternoon (12PM-5PM)";
    else if (curr.hourOfDay >= 17 && curr.hourOfDay < 21) timeBlock = "Evening (5PM-9PM)";
    else timeBlock = "Night (9PM-5AM)";

    const existingBlock = acc.find(item => item.timeBlock === timeBlock);
    if (existingBlock) {
      existingBlock.count += 1;
      existingBlock.totalScore += curr.levelScore;
      existingBlock.avgScore = existingBlock.totalScore / existingBlock.count;
    } else {
      acc.push({
        timeBlock,
        count: 1,
        totalScore: curr.levelScore,
        avgScore: curr.levelScore
      });
    }
    return acc;
  }, [] as { timeBlock: string; count: number; totalScore: number; avgScore: number }[]) || [];

  const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const orderedDayData = [...dayOfWeekData].sort((a, b) => 
    dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  );

  const timeBlockOrder = ["Morning (5AM-12PM)", "Afternoon (12PM-5PM)", "Evening (5PM-9PM)", "Night (9PM-5AM)"];
  const orderedTimeData = [...hourOfDayData].sort((a, b) => 
    timeBlockOrder.indexOf(a.timeBlock) - timeBlockOrder.indexOf(b.timeBlock)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 to-white">
      <Header activeTab="assessment" onTabChange={(tab) => setLocation(tab === "assessment" ? "/" : "/")} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text animate-gradient">
              Stress Report Dashboard
            </h1>
            <Button 
              size="sm" 
              className="mt-4 md:mt-0 self-center md:self-auto bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white"
              onClick={() => setLocation("/profile/edit")}
            >
              <span className="mr-2">👤</span> Edit Profile
            </Button>
          </div>
          <p className="text-neutral-600 max-w-2xl mx-auto md:mx-0">
            Welcome back, <span className="font-semibold text-indigo-600">{user?.name || "User"}</span>! Here's your personalized stress analysis and wellbeing journey.
          </p>
        </div>
        
        {/* Stress Stats Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Average Stress Level Card */}
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Average Stress Level</p>
                <h3 className="text-2xl font-bold">
                  {processedAssessments?.length 
                    ? (processedAssessments.reduce((sum, a) => sum + a.levelScore, 0) / processedAssessments.length).toFixed(1) 
                    : '–'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Out of 3.0</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Total Assessments Card */}
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total Assessments</p>
                <h3 className="text-2xl font-bold">{processedAssessments?.length || 0}</h3>
                <p className="text-xs text-neutral-400 mt-1">Lifetime check-ins</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CalendarDays className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Today's Status Card */}
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-cyan-500 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Today's Status</p>
                <h3 className="text-2xl font-bold">
                  {(processedAssessments || []).filter(a => 
                    new Date(a.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                  ).length > 0 ? 'Checked In' : 'Not Yet'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Last check-in today</p>
              </div>
              <div className="bg-cyan-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
          </div>

          {/* Assessments Remaining Card */}
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-emerald-500 hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 transition-transform">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Daily Limit</p>
                <h3 className="text-2xl font-bold">
                  {3 - (processedAssessments?.filter(a => 
                    new Date(a.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                  ).length || 0)} of 3
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Assessments remaining today</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <BarChart2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="trends">
          <TabsList className="mb-6 flex flex-wrap sm:flex-nowrap gap-1 sm:gap-0 overflow-x-auto pb-2">
            <TabsTrigger value="trends" className="flex items-center whitespace-nowrap text-xs sm:text-sm">
              <Activity className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Stress Trends
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center whitespace-nowrap text-xs sm:text-sm">
              <CalendarDays className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Weekly Analysis
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center whitespace-nowrap text-xs sm:text-sm">
              <Clock className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Time-Based
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center whitespace-nowrap text-xs sm:text-sm">
              <BarChart2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Stress Level Trends
                </CardTitle>
                <CardDescription>
                  Track your stress levels over time to identify patterns and trends.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <p>Loading stress data...</p>
                  </div>
                ) : sortedAssessments && sortedAssessments.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={sortedAssessments}
                        margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          angle={-45} 
                          textAnchor="end"
                          height={70}
                          tickMargin={20}
                          tick={{fontSize: 10}}
                          tickCount={5}
                        />
                        <YAxis 
                          domain={[0, 3]} 
                          ticks={[1, 2, 3]} 
                          tickFormatter={(value) => {
                            switch (value) {
                              case 1: return 'Low';
                              case 2: return 'Medium';
                              case 3: return 'High';
                              default: return '';
                            }
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'levelScore') {
                              switch (value) {
                                case 1: return ['Low', 'Stress Level'];
                                case 2: return ['Medium', 'Stress Level'];
                                case 3: return ['High', 'Stress Level'];
                                default: return [value, name];
                              }
                            }
                            return [value, name];
                          }}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Legend />
                        <defs>
                          <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <Line 
                          type="monotone" 
                          dataKey="levelScore" 
                          name="Stress Level" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          dot={{ stroke: '#6366f1', strokeWidth: 2, r: 4, fill: 'white' }}
                          activeDot={{ r: 8, stroke: '#4f46e5', strokeWidth: 2, fill: '#818cf8' }}
                          fillOpacity={1}
                          fill="url(#colorLevel)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No assessment data available</p>
                    <Button onClick={() => setLocation("/")}>Take Assessment</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="mr-2 h-5 w-5 text-primary" />
                  Weekly Stress Analysis
                </CardTitle>
                <CardDescription>
                  See how your stress levels vary by day of the week.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <p>Loading weekly data...</p>
                  </div>
                ) : orderedDayData && orderedDayData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={orderedDayData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{fontSize: 10}} />
                        <YAxis 
                          domain={[0, 3]} 
                          ticks={[1, 2, 3]} 
                          tickFormatter={(value) => {
                            switch (value) {
                              case 1: return 'Low';
                              case 2: return 'Medium';
                              case 3: return 'High';
                              default: return '';
                            }
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'avgScore') {
                              const formattedValue = parseFloat(value as string).toFixed(2);
                              return [formattedValue, 'Avg Stress Level'];
                            }
                            return [value, name];
                          }}
                        />
                        <Legend />
                        <defs>
                          <linearGradient id="weeklyBarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <Bar 
                          dataKey="avgScore" 
                          name="Average Stress Level" 
                          radius={[6, 6, 0, 0]}
                          fill="url(#weeklyBarGradient)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No weekly data available</p>
                    <Button onClick={() => setLocation("/")}>Take Assessment</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="time" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Time-Based Stress Analysis
                </CardTitle>
                <CardDescription>
                  Analyze how your stress levels vary by time of day.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <p>Loading time-based data...</p>
                  </div>
                ) : orderedTimeData && orderedTimeData.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={orderedTimeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timeBlock" tick={{fontSize: 10}} />
                        <YAxis 
                          domain={[0, 3]} 
                          ticks={[1, 2, 3]} 
                          tickFormatter={(value) => {
                            switch (value) {
                              case 1: return 'Low';
                              case 2: return 'Medium';
                              case 3: return 'High';
                              default: return '';
                            }
                          }}
                        />
                        <Tooltip 
                          formatter={(value, name) => {
                            if (name === 'avgScore') {
                              const formattedValue = parseFloat(value as string).toFixed(2);
                              return [formattedValue, 'Avg Stress Level'];
                            }
                            return [value, name];
                          }}
                        />
                        <Legend />
                        <defs>
                          <linearGradient id="timeBarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                            <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <Bar 
                          dataKey="avgScore" 
                          name="Average Stress Level" 
                          radius={[6, 6, 0, 0]}
                          fill="url(#timeBarGradient)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No time-based data available</p>
                    <Button onClick={() => setLocation("/")}>Take Assessment</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart2 className="mr-2 h-5 w-5 text-primary" />
                  Assessment History
                </CardTitle>
                <CardDescription>
                  View your complete assessment history and track your progress over time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-full flex items-center justify-center p-8">
                    <p>Loading assessment history...</p>
                  </div>
                ) : processedAssessments && processedAssessments.length > 0 ? (
                  <div className="space-y-6">
                    {/* Today's assessment count */}
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">Daily Limit</h3>
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ease-in-out ${
                                processedAssessments.filter(a => 
                                  new Date(a.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                                ).length >= 3 ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ 
                                width: `${Math.min(
                                  (processedAssessments.filter(a => 
                                    new Date(a.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                                  ).length / 3) * 100, 
                                  100
                                )}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <span className="ml-4 text-sm">
                          {3 - processedAssessments.filter(a => 
                            new Date(a.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                          ).length} of 3 assessments remaining today
                        </span>
                      </div>
                    </div>

                    {/* Assessment list */}
                    <div className="border rounded-lg overflow-hidden overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Score
                            </th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Level
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {[...processedAssessments].reverse().map((assessment) => (
                            <tr key={assessment.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                {assessment.date}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                {assessment.time}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                                {assessment.score}/50
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${assessment.level === 'low' 
                                    ? 'bg-green-100 text-green-800' 
                                    : assessment.level === 'medium' 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                  {assessment.level.charAt(0).toUpperCase() + assessment.level.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Call to action */}
                    <div className="flex justify-center mt-4">
                      <Button 
                        onClick={() => setLocation("/")}
                        disabled={processedAssessments.filter(a => 
                          new Date(a.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                        ).length >= 3}
                      >
                        {processedAssessments.filter(a => 
                          new Date(a.timestamp).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                        ).length >= 3 
                          ? 'Daily Limit Reached' 
                          : 'Take Another Assessment'
                        }
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-60 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No assessment history available</p>
                    <Button onClick={() => setLocation("/")}>Take Your First Assessment</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;