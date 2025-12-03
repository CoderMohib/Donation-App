import { CampaignCard } from "@/src/components/cards";
import { ConfirmDialog, Toast } from "@/src/components/feedback";
import { SearchBar } from "@/src/components/inputs";
import { DashboardLayout } from "@/src/components/layouts";
import { FilterTabs } from "@/src/components/navigation";
import { CampaignListSkeleton } from "@/src/components/skeletons/CampaignCardSkeleton";
import {
  approveCampaign,
  deleteCampaign,
  endCampaign,
  rejectCampaign,
  startCampaign,
} from "@/src/firebase/firestore";
import { useAuth, useCampaigns, useToast } from "@/src/hooks";
import { Campaign } from "@/src/types";
import { asyncHandler } from "@/src/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Active", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Ended", value: "ended" },
];

export default function AdminCampaignsScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean;
    type: "start" | "end" | "delete" | "approve" | "reject" | null;
    campaignId: string;
    campaignTitle: string;
  }>({ visible: false, type: null, campaignId: "", campaignTitle: "" });

  // Rejection modal state
  const [rejectionModal, setRejectionModal] = useState<{
    visible: boolean;
    campaignId: string;
    campaignTitle: string;
    reason: string;
  }>({ visible: false, campaignId: "", campaignTitle: "", reason: "" });

  // Fetch all campaigns (no ownerId filter for admin)
  const { campaigns, loading, error, refetch } = useCampaigns({
    status:
      selectedStatus === "all"
        ? undefined
        : (selectedStatus as Campaign["status"]),
  });

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.shortDescription
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      campaign.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Limit displayed campaigns for pagination
  const displayedCampaigns = filteredCampaigns.slice(0, displayLimit);
  const hasMore = filteredCampaigns.length > displayLimit;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/(tabs)");
    }
  }, [user, authLoading]);

  // Reset display limit when filters or search change
  useEffect(() => {
    setDisplayLimit(10);
  }, [selectedStatus, searchQuery]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setDisplayLimit(10); // Reset to initial limit on refresh
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  const handleStartCampaign = (campaignId: string, title: string) => {
    setConfirmDialog({
      visible: true,
      type: "start",
      campaignId,
      campaignTitle: title,
    });
  };

  const handleEndCampaign = (campaignId: string, title: string) => {
    setConfirmDialog({
      visible: true,
      type: "end",
      campaignId,
      campaignTitle: title,
    });
  };

  const handleDeleteCampaign = (campaignId: string, title: string) => {
    setConfirmDialog({
      visible: true,
      type: "delete",
      campaignId,
      campaignTitle: title,
    });
  };

  const handleApproveCampaign = (campaignId: string, title: string) => {
    setConfirmDialog({
      visible: true,
      type: "approve",
      campaignId,
      campaignTitle: title,
    });
  };

  const handleRejectCampaign = (campaignId: string, title: string) => {
    setRejectionModal({
      visible: true,
      campaignId,
      campaignTitle: title,
      reason: "",
    });
  };

  const handleConfirmAction = async () => {
    const { type, campaignId } = confirmDialog;
    setConfirmDialog({
      visible: false,
      type: null,
      campaignId: "",
      campaignTitle: "",
    });

    if (!user) return;

    if (type === "start") {
      // Admin can start any campaign (bypass approval check)
      const [, error] = await asyncHandler(startCampaign(campaignId, true));
      if (error) {
        showError(error.message || "Failed to start campaign");
      } else {
        showSuccess("Campaign started successfully!");
      }
    } else if (type === "end") {
      const [, error] = await asyncHandler(endCampaign(campaignId));
      if (error) {
        showError(error.message || "Failed to end campaign");
      } else {
        showSuccess("Campaign ended successfully!");
      }
    } else if (type === "delete") {
      const [, error] = await asyncHandler(deleteCampaign(campaignId));
      if (error) {
        showError(error.message || "Failed to delete campaign");
      } else {
        showSuccess("Campaign deleted successfully!");
      }
    } else if (type === "approve") {
      const [, error] = await asyncHandler(
        approveCampaign(campaignId, user.id, "Your campaign looks great!")
      );
      if (error) {
        showError(error.message || "Failed to approve campaign");
      } else {
        showSuccess("Campaign approved! Owner has been notified via email.");
      }
    }
  };

  const handleConfirmRejection = async () => {
    const { campaignId, reason } = rejectionModal;

    if (!reason.trim()) {
      showError("Please provide a rejection reason");
      return;
    }

    if (!user) return;

    setRejectionModal({
      visible: false,
      campaignId: "",
      campaignTitle: "",
      reason: "",
    });

    const [, error] = await asyncHandler(
      rejectCampaign(campaignId, user.id, reason)
    );

    if (error) {
      showError(error.message || "Failed to reject campaign");
    } else {
      showSuccess("Campaign rejected. Owner has been notified via email.");
    }
  };

  const handleCancelAction = () => {
    setConfirmDialog({
      visible: false,
      type: null,
      campaignId: "",
      campaignTitle: "",
    });
  };

  const handleEditCampaign = (campaignId: string) => {
    router.push({
      pathname: "/campaign/edit/[id]",
      params: { id: campaignId },
    });
  };

  const renderCampaignActions = (campaign: Campaign) => (
    <View className="flex-row gap-2 mt-3 flex-wrap">
      {/* Approval Status Badge */}
      {campaign.approvalStatus && (
        <View className="w-full mb-2">
          <View
            className={`rounded-full py-1 px-3 self-start ${
              campaign.approvalStatus === "approved"
                ? "bg-green-100"
                : campaign.approvalStatus === "rejected"
                  ? "bg-red-100"
                  : "bg-yellow-100"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                campaign.approvalStatus === "approved"
                  ? "text-green-700"
                  : campaign.approvalStatus === "rejected"
                    ? "text-red-700"
                    : "text-yellow-700"
              }`}
            >
              {campaign.approvalStatus === "approved"
                ? "✓ Approved"
                : campaign.approvalStatus === "rejected"
                  ? "✗ Rejected"
                  : "⏳ Pending Approval"}
            </Text>
          </View>
          {campaign.approvalStatus === "rejected" &&
            campaign.rejectionReason && (
              <Text className="text-red-600 text-xs mt-1">
                Reason: {campaign.rejectionReason}
              </Text>
            )}
        </View>
      )}

      {/* Approve Button (only for non-approved campaigns) */}
      {campaign.approvalStatus !== "approved" && (
        <TouchableOpacity
          onPress={() => handleApproveCampaign(campaign.id, campaign.title)}
          className="bg-emerald-500 rounded-full py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="checkmark-circle" size={16} color="white" />
          <Text className="text-white font-semibold ml-1">Approve</Text>
        </TouchableOpacity>
      )}

      {/* Reject Button (only for non-rejected campaigns) */}
      {campaign.approvalStatus !== "rejected" && (
        <TouchableOpacity
          onPress={() => handleRejectCampaign(campaign.id, campaign.title)}
          className="bg-amber-500 rounded-full py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="close-circle" size={16} color="white" />
          <Text className="text-white font-semibold ml-1">Reject</Text>
        </TouchableOpacity>
      )}

      {/* Edit Button */}
      <TouchableOpacity
        onPress={() => handleEditCampaign(campaign.id)}
        className="bg-blue-500 rounded-full py-2 px-3 flex-row items-center justify-center"
      >
        <Ionicons name="pencil" size={16} color="white" />
        <Text className="text-white font-semibold ml-1">Edit</Text>
      </TouchableOpacity>

      {/* Start Button (admins can start any draft campaign) */}
      {campaign.status === "draft" && (
        <TouchableOpacity
          onPress={() => handleStartCampaign(campaign.id, campaign.title)}
          className="bg-green-500 rounded-full py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="play" size={16} color="white" />
          <Text className="text-white font-semibold ml-1">Start</Text>
        </TouchableOpacity>
      )}

      {/* End Button (only for in_progress) */}
      {campaign.status === "in_progress" && (
        <TouchableOpacity
          onPress={() => handleEndCampaign(campaign.id, campaign.title)}
          className="bg-orange-500 rounded-full py-2 px-3 flex-row items-center justify-center"
        >
          <Ionicons name="stop" size={16} color="white" />
          <Text className="text-white font-semibold ml-1">End</Text>
        </TouchableOpacity>
      )}

      {/* Delete Button */}
      <TouchableOpacity
        onPress={() => handleDeleteCampaign(campaign.id, campaign.title)}
        className="bg-red-500 rounded-full py-2 px-3 flex-row items-center justify-center"
      >
        <Ionicons name="trash" size={16} color="white" />
        <Text className="text-white font-semibold ml-1">Delete</Text>
      </TouchableOpacity>

      {/* Owner Info */}
      <View className="w-full mt-2 pt-2 border-t border-gray-200">
        <Text className="text-gray-500 text-xs">
          Created by:{" "}
          <Text className="text-gray-900">{campaign.ownerName}</Text>
        </Text>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View className="py-4">
        <TouchableOpacity
          onPress={handleLoadMore}
          className="bg-primary-500 rounded-full py-3 px-6 mx-4"
        >
          <Text className="text-white font-semibold text-center">
            Load More Campaigns
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <View className="mb-4">
      <CampaignCard
        campaign={item}
        onPress={() =>
          router.push({
            pathname: "/campaign/[id]",
            params: { id: item.id },
          })
        }
      />
      {renderCampaignActions(item)}
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">💼</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2">
        No Campaigns Found
      </Text>
      <Text className="text-gray-500 text-center px-8">
        {searchQuery
          ? "Try a different search term"
          : selectedStatus === "all"
            ? "No campaigns in the system yet"
            : `No ${selectedStatus === "in_progress" ? "active" : selectedStatus} campaigns found`}
      </Text>
    </View>
  );

  const renderError = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">⚠️</Text>
      <Text className="text-gray-900 text-xl font-bold mb-2">
        Error Loading Campaigns
      </Text>
      <Text className="text-gray-500 text-center px-8">
        {error?.message || "Something went wrong"}
      </Text>
    </View>
  );

  if (authLoading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#ff7a5e" />
      </View>
    );
  }

  if (!user || user.role !== "admin") return null;

  return (
    <DashboardLayout
      title="Manage Campaigns"
      showBackButton={false}
      scrollable={false}
    >
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />

      <ConfirmDialog
        visible={confirmDialog.visible}
        title={
          confirmDialog.type === "start"
            ? "Start Campaign"
            : confirmDialog.type === "end"
              ? "End Campaign"
              : confirmDialog.type === "approve"
                ? "Approve Campaign"
                : "Delete Campaign"
        }
        message={
          confirmDialog.type === "start"
            ? `Are you sure you want to start "${confirmDialog.campaignTitle}"? Once started, it will be visible to all users.`
            : confirmDialog.type === "end"
              ? `Are you sure you want to end "${confirmDialog.campaignTitle}"? This will prevent further donations.`
              : confirmDialog.type === "approve"
                ? `Are you sure you want to approve "${confirmDialog.campaignTitle}"? The campaign owner will be notified via email.`
                : `Are you sure you want to delete "${confirmDialog.campaignTitle}"? This action cannot be undone.`
        }
        confirmText={
          confirmDialog.type === "start"
            ? "Start Campaign"
            : confirmDialog.type === "end"
              ? "End Campaign"
              : confirmDialog.type === "approve"
                ? "Approve Campaign"
                : "Delete Campaign"
        }
        confirmColor={confirmDialog.type === "delete" ? "danger" : "primary"}
        icon={
          confirmDialog.type === "start"
            ? "rocket"
            : confirmDialog.type === "end"
              ? "stop-circle"
              : confirmDialog.type === "approve"
                ? "checkmark-circle"
                : "trash"
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      {/* Rejection Modal */}
      <Modal
        visible={rejectionModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setRejectionModal({
            visible: false,
            campaignId: "",
            campaignTitle: "",
            reason: "",
          })
        }
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <View className="items-center mb-4">
              <View className="bg-amber-100 rounded-full p-3 mb-3">
                <Ionicons name="close-circle" size={32} color="#f59e0b" />
              </View>
              <Text className="text-xl font-bold text-gray-900 text-center">
                Reject Campaign
              </Text>
              <Text className="text-gray-600 text-center mt-1">
                "{rejectionModal.campaignTitle}"
              </Text>
            </View>

            <Text className="text-gray-700 font-semibold mb-2">
              Rejection Reason *
            </Text>
            <TextInput
              value={rejectionModal.reason}
              onChangeText={(text) =>
                setRejectionModal({ ...rejectionModal, reason: text })
              }
              placeholder="Please provide a detailed reason for rejection..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
              style={{ minHeight: 100 }}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() =>
                  setRejectionModal({
                    visible: false,
                    campaignId: "",
                    campaignTitle: "",
                    reason: "",
                  })
                }
                className="flex-1 bg-gray-200 rounded-full py-3"
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmRejection}
                className="flex-1 bg-amber-500 rounded-full py-3"
              >
                <Text className="text-white font-semibold text-center">
                  Reject Campaign
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className=" bg-gray-50">
        {/* Search Bar */}
        <View className="px-4 pt-2 mb-3">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search campaigns..."
            className="mb-0"
          />
        </View>

        {/* Filter Tabs */}
        <View className="mb-3">
          <FilterTabs
            tabs={STATUS_FILTERS}
            activeTab={selectedStatus}
            onTabChange={setSelectedStatus}
          />
        </View>

        {/* Campaigns List */}
        {error ? (
          renderError()
        ) : loading ? (
          <View className="px-4">
            <CampaignListSkeleton count={5} />
          </View>
        ) : (
          <FlatList
            data={displayedCampaigns}
            renderItem={renderCampaign}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 110,
            }}
            ListEmptyComponent={renderEmptyState()}
            ListFooterComponent={renderFooter}
            onEndReached={hasMore ? handleLoadMore : undefined}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#10b981"]} // primary-500 green color
                tintColor="#10b981"
              />
            }
          />
        )}
      </View>
    </DashboardLayout>
  );
}
