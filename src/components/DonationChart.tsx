import { useAuth } from "@/src/hooks/useAuth";
import { Donation } from "@/src/types/Donation";
import { generateDonationPDF } from "@/src/utils/generateDonationPDF";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

type FilterType = "day" | "month" | "year";

interface DonationChartProps {
  donations: Donation[];
}

export const DonationChart: React.FC<DonationChartProps> = ({ donations }) => {
  const [filter, setFilter] = useState<FilterType>("day");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const { user } = useAuth();

  const chartData = useMemo(() => {
    if (!donations || donations.length === 0) return [];

    const aggregatedData: Record<string, number> = {};

    donations.forEach((donation) => {
      const date = new Date(donation.donatedAt);
      let key = "";

      if (filter === "day") {
        key = date.toISOString().split("T")[0];
      } else if (filter === "month") {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      } else if (filter === "year") {
        key = `${date.getFullYear()}`;
      }

      if (donation.status === "completed") {
        aggregatedData[key] = (aggregatedData[key] || 0) + donation.amount;
      }
    });

    const sortedKeys = Object.keys(aggregatedData).sort();

    return sortedKeys.map((key) => {
      let label = key;
      const date = new Date(key);

      if (filter === "day") {
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });
        label = `${day} ${month}`;
      } else if (filter === "month") {
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear().toString().slice(2);
        label = `${month} '${year}`;
      } else if (filter === "year") {
        label = key;
      }

      return {
        value: aggregatedData[key],
        label: label,
        frontColor: "#ff7a5e",
        topLabelComponent: () => (
          <Text style={{ color: "#6B7280", fontSize: 10, marginBottom: 4 }}>
            ${aggregatedData[key]}
          </Text>
        ),
      };
    });
  }, [donations, filter]);

  const getPeriodLabel = (): string => {
    const now = new Date();
    if (filter === "day") {
      return `Daily Statement - ${now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`;
    } else if (filter === "month") {
      return `Monthly Statement - ${now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })}`;
    } else {
      return `Yearly Statement - ${now.getFullYear()}`;
    }
  };

  const handleExportPDF = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to export donation statements");
      return;
    }

    if (donations.length === 0) {
      Alert.alert(
        "No Data",
        "No donations available to export for this period"
      );
      return;
    }

    setIsGeneratingPDF(true);

    const result = await generateDonationPDF({
      donations,
      user,
      filter,
      periodLabel: getPeriodLabel(),
    });

    setIsGeneratingPDF(false);

    if (result.success) {
      Alert.alert(
        "Success",
        "Donation statement has been generated and shared!"
      );
    } else {
      Alert.alert("Error", result.error || "Failed to generate PDF");
    }
  };

  const renderFilterButton = (type: FilterType, label: string) => (
    <TouchableOpacity
      className={`flex-1 py-2 items-center rounded-md ${
        filter === type ? "bg-white" : ""
      }`}
      style={filter === type ? { elevation: 1 } : {}}
      onPress={() => setFilter(type)}
    >
      <Text
        className={`text-sm ${
          filter === type
            ? "text-primary-500 font-bold"
            : "text-gray-500 font-medium"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      className="bg-white rounded-2xl p-4 my-2.5 border border-gray-100"
      style={{ elevation: 2 }}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-gray-800">
          Donation History
        </Text>

        <TouchableOpacity
          className="flex-row items-center bg-primary-500 px-3 py-2 rounded-lg"
          style={{ elevation: 2 }}
          onPress={handleExportPDF}
          disabled={isGeneratingPDF || donations.length === 0}
        >
          {isGeneratingPDF ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="download-outline" size={16} color="white" />
              <Text className="text-white text-xs font-semibold ml-1">
                Export PDF
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-5 bg-gray-100 rounded-lg p-1">
        {renderFilterButton("day", "Day")}
        {renderFilterButton("month", "Month")}
        {renderFilterButton("year", "Year")}
      </View>

      <View className="items-center justify-center" style={{ minHeight: 220 }}>
        {chartData.length > 0 ? (
          <BarChart
            data={chartData}
            barWidth={28}
            spacing={20}
            noOfSections={4}
            barBorderRadius={4}
            frontColor="#ff7a5e"
            yAxisThickness={0}
            xAxisThickness={0}
            isAnimated
            height={190}
            width={screenWidth - 80}
            xAxisLabelTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
            yAxisTextStyle={{ color: "#9CA3AF", fontSize: 10 }}
            hideRules
            showGradient
            gradientColor={"#ff9e8a"}
            initialSpacing={10}
            endSpacing={10}
          />
        ) : (
          <View className="h-[200px] justify-center items-center">
            <Text className="text-gray-400 text-sm">
              No donation data available for this period.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
