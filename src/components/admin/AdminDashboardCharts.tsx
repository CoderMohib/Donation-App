import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

interface ChartCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon, children }) => (
  <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
    <View className="flex-row items-center mb-4">
      <View className="bg-primary-100 p-2 rounded-lg mr-3">
        <Ionicons name={icon} size={20} color="#ff7a5e" />
      </View>
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
    </View>
    {children}
  </View>
);

interface DonationTrendChartProps {
  data: Array<{ value: number; label: string; count: number; date: string }>;
}

export const DonationTrendChart: React.FC<DonationTrendChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Donation Trend" icon="trending-up">
        <View className="h-48 justify-center items-center">
          <Text className="text-gray-400">No donation data available</Text>
        </View>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Donation Trend (Last 30 Days)" icon="trending-up">
      <LineChart
        data={data}
        width={screenWidth - 80}
        height={200}
        spacing={Math.max(30, (screenWidth - 100) / data.length)}
        initialSpacing={10}
        color="#ff7a5e"
        thickness={3}
        startFillColor="rgba(255, 122, 94, 0.3)"
        endFillColor="rgba(255, 122, 94, 0.01)"
        startOpacity={0.9}
        endOpacity={0.2}
        areaChart
        hideDataPoints={data.length > 15}
        dataPointsColor="#ff7a5e"
        dataPointsRadius={4}
        textColor="#6B7280"
        textFontSize={10}
        yAxisColor="#E5E7EB"
        xAxisColor="#E5E7EB"
        yAxisTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
        xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 9, width: 40 }}
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        isAnimated
        animationDuration={1000}
      />
      <View className="mt-3 flex-row justify-between">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-primary-500 mr-2" />
          <Text className="text-gray-600 text-xs">Total Amount</Text>
        </View>
        <Text className="text-gray-500 text-xs">
          {data.reduce((sum, d) => sum + d.count, 0)} donations
        </Text>
      </View>
    </ChartCard>
  );
};

interface CampaignPerformanceChartProps {
  data: Array<{
    name: string;
    fullName: string;
    revenue: number;
    donationCount: number;
  }>;
}

export const CampaignPerformanceChart: React.FC<
  CampaignPerformanceChartProps
> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Top Campaigns" icon="trophy">
        <View className="h-48 justify-center items-center">
          <Text className="text-gray-400">No campaign data available</Text>
        </View>
      </ChartCard>
    );
  }

  const chartData = data.map((item) => ({
    value: item.revenue,
    label: item.name,
    frontColor: "#ff7a5e",
    topLabelComponent: () => (
      <Text style={{ color: "#6B7280", fontSize: 10, marginBottom: 4 }}>
        ${item.revenue.toLocaleString()}
      </Text>
    ),
  }));

  return (
    <ChartCard title="Top 5 Campaigns by Revenue" icon="trophy">
      <BarChart
        data={chartData}
        barWidth={40}
        spacing={20}
        noOfSections={4}
        barBorderRadius={6}
        frontColor="#ff7a5e"
        yAxisThickness={0}
        xAxisThickness={0}
        isAnimated
        height={220}
        width={screenWidth - 80}
        xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 9, width: 60 }}
        yAxisTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
        hideRules
        showGradient
        gradientColor="#ff9e8a"
        initialSpacing={15}
        endSpacing={15}
      />
      <View className="mt-3">
        {data.map((item, index) => (
          <View
            key={index}
            className="flex-row justify-between items-center py-2 border-b border-gray-100"
          >
            <Text className="text-gray-700 text-xs flex-1" numberOfLines={1}>
              {item.fullName}
            </Text>
            <Text className="text-gray-500 text-xs ml-2">
              {item.donationCount} donations
            </Text>
          </View>
        ))}
      </View>
    </ChartCard>
  );
};

interface UserGrowthChartProps {
  data: Array<{ value: number; label: string; month: string }>;
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="User Growth" icon="people">
        <View className="h-48 justify-center items-center">
          <Text className="text-gray-400">No user data available</Text>
        </View>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="User Growth (Last 6 Months)" icon="people">
      <LineChart
        data={data}
        width={screenWidth - 80}
        height={180}
        spacing={Math.max(40, (screenWidth - 100) / data.length)}
        initialSpacing={20}
        color="#4894a8"
        thickness={3}
        startFillColor="rgba(72, 148, 168, 0.3)"
        endFillColor="rgba(72, 148, 168, 0.01)"
        startOpacity={0.9}
        endOpacity={0.2}
        areaChart
        hideDataPoints={false}
        dataPointsColor="#4894a8"
        dataPointsRadius={5}
        textColor="#6B7280"
        textFontSize={10}
        yAxisColor="#E5E7EB"
        xAxisColor="#E5E7EB"
        yAxisTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
        xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
        noOfSections={4}
        yAxisThickness={0}
        xAxisThickness={0}
        hideRules
        isAnimated
        animationDuration={1000}
      />
      <View className="mt-3">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full bg-secondary-500 mr-2" />
          <Text className="text-gray-600 text-xs">New Users</Text>
        </View>
      </View>
    </ChartCard>
  );
};

interface DonationStatusChartProps {
  data: Array<{
    value: number;
    color: string;
    text: string;
    percentage: string;
  }>;
}

export const DonationStatusChart: React.FC<DonationStatusChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Donation Status" icon="pie-chart">
        <View className="h-48 justify-center items-center">
          <Text className="text-gray-400">No status data available</Text>
        </View>
      </ChartCard>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ChartCard title="Donation Status Distribution" icon="pie-chart">
      <View className="items-center">
        <PieChart
          data={data}
          donut
          radius={80}
          innerRadius={50}
          innerCircleColor="#fff"
          centerLabelComponent={() => (
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">{total}</Text>
              <Text className="text-xs text-gray-500">Total</Text>
            </View>
          )}
        />
        <View className="mt-4 w-full">
          {data.map((item, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-2"
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-gray-700 text-sm">{item.text}</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-semibold text-sm mr-2">
                  {item.value}
                </Text>
                <Text className="text-gray-500 text-xs">
                  ({item.percentage}%)
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ChartCard>
  );
};

interface MonthlyRevenueChartProps {
  data: Array<{
    value: number;
    label: string;
    frontColor: string;
    month: string;
  }>;
}

export const MonthlyRevenueChart: React.FC<MonthlyRevenueChartProps> = ({
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <ChartCard title="Monthly Revenue" icon="cash">
        <View className="h-48 justify-center items-center">
          <Text className="text-gray-400">No revenue data available</Text>
        </View>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Monthly Revenue (Current Year)" icon="cash">
      <BarChart
        data={data}
        barWidth={20}
        spacing={15}
        noOfSections={4}
        barBorderRadius={4}
        yAxisThickness={0}
        xAxisThickness={0}
        isAnimated
        height={200}
        width={screenWidth - 80}
        xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 9 }}
        yAxisTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
        hideRules
        showGradient
        gradientColor="#ff9e8a"
        initialSpacing={10}
        endSpacing={10}
      />
      <View className="mt-3 flex-row justify-between">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-sm bg-primary-500 mr-2" />
          <Text className="text-gray-600 text-xs">Current Month</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-sm bg-primary-200 mr-2" />
          <Text className="text-gray-600 text-xs">Other Months</Text>
        </View>
      </View>
    </ChartCard>
  );
};
