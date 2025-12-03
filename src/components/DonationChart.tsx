import { Donation } from "@/src/types/Donation";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  StyleSheet,
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
  const screenWidth = Dimensions.get("window").width;

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

  const renderFilterButton = (type: FilterType, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === type && styles.activeFilterButton,
      ]}
      onPress={() => setFilter(type)}
    >
      <Text
        style={[styles.filterText, filter === type && styles.activeFilterText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donation History</Text>

      <View style={styles.filterContainer}>
        {renderFilterButton("day", "Day")}
        {renderFilterButton("month", "Month")}
        {renderFilterButton("year", "Year")}
      </View>

      <View style={styles.chartContainer}>
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
            height={180}
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
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              No donation data available for this period.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1F2937",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeFilterButton: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#ff7a5e",
    fontWeight: "bold",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 220,
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});
