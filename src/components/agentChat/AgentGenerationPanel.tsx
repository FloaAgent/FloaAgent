import React, { useRef } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Tabs, Tab } from "@heroui/tabs";
import { Textarea } from "@heroui/input";
import { useTranslation } from "react-i18next";
import {
  FaRobot,
  FaImage,
  FaTimes,
  FaDownload,
  FaCopy,
  FaExpand,
  FaShare,
} from "react-icons/fa";
import { addToast } from "@heroui/toast";
import type { DigitalHuman } from "@/services";
import { copyToClipboard } from "@/utils/copyToClipboard";


type ChatCategory = "image-to-image" | "image-to-video";


type TaskStatus = "pending" | "processing" | "completed" | "failed";

interface Message {
  id: string;
  type: "user" | "agent";
  category: ChatCategory | "chat" | "text-to-image" | "text-to-video";
  content: string;
  timestamp: Date;
  mediaUrls?: string[];
  taskId?: string;
  taskStatus?: TaskStatus;
  isLoading?: boolean;
}

interface UploadedImage {
  file: File;
  preview: string;
  url?: string;
  isUploading?: boolean;
}

interface AgentGenerationPanelProps {
  selectedAgent: DigitalHuman | null;
  userInfo: any;
  chatCategory: ChatCategory;
  onChatCategoryChange: (category: ChatCategory) => void;
  generatePrompt: string;
  onGeneratePromptChange: (value: string) => void;
  uploadedImages: UploadedImage[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  messages: Message[];
  isSending: boolean;
  onGenerateImage: () => void;
  onGenerateVideo: () => void;
  onDownload: (url: string, filename: string) => void;
  onPreview: (url: string, type: "image" | "video") => void;
  onShare?: (messageId: string) => void;
}


export const AgentGenerationPanel: React.FC<AgentGenerationPanelProps> = ({
  selectedAgent,
  userInfo,
  chatCategory,
  onChatCategoryChange,
  generatePrompt,
  onGeneratePromptChange,
  uploadedImages,
  onImageUpload,
  onRemoveImage,
  messages,
  isSending,
  onGenerateImage,
  onGenerateVideo,
  onDownload,
  onPreview,
  onShare,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="h-full bg-[#1F1F1F] backdrop-blur-sm flex flex-col relative">
      {}
      {!userInfo && (
        <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center p-6">
            <FaRobot className="text-6xl mx-auto mb-4 text-primary" />
            <p className="text-lg font-semibold text-default-900 mb-2">
              {t("agentChat.pleaseConnectWallet")}
            </p>
            <p className="text-sm text-default-500">
              {t("agentChat.connectWalletToUseFeatures")}
            </p>
          </div>
        </div>
      )}

      {}
      {selectedAgent && userInfo && selectedAgent.userId !== userInfo.id && (
        <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center p-6">
            <FaRobot className="text-6xl mx-auto mb-4 text-default-500" />
            <p className="text-lg font-semibold text-default-900 mb-2">
              {t("agentChat.notYourAgent")}
            </p>
            <p className="text-sm text-default-500">
              {t("agentChat.cannotUseFeature")}
            </p>
          </div>
        </div>
      )}

      {}
      <div className="p-4 flex-shrink-0 border-b border-default-200">
        <Tabs
          selectedKey={chatCategory}
          onSelectionChange={(key) => onChatCategoryChange(key as ChatCategory)}
          size="sm"
          color="primary"
          variant="bordered"
          classNames={{
            tabList: "gap-2",
            cursor: "bg-primary",
            tab: "px-3",
          }}
        >
          {}
          <Tab key="image-to-video" title={t("agentChat.imageToVideo")} />
        </Tabs>

        {}
        <div className="space-y-3 mt-3">
          {}
          <Textarea
            variant="bordered"
            placeholder={t("agentChat.enterPrompt")}
            value={generatePrompt}
            onValueChange={onGeneratePromptChange}
            size="sm"
            disabled={isSending}
            minRows={2}
            maxRows={4}
          />

          {}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageUpload}
              aria-label={t("agentChat.uploadImage")}
            />
            <Button
              size="sm"
              variant="flat"
              color="secondary"
              startContent={<FaImage />}
              onPress={handleUploadClick}
              isDisabled={uploadedImages.length > 0}
            >
              {t("agentChat.uploadImage")}
            </Button>
          </div>

          {}
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadedImages.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden border-2 border-default-200 max-w-[100px]"
                >
                  <img
                    src={img.preview}
                    alt={`${t("agentChat.uploadImage")} ${index + 1}`}
                    className="w-full h-auto object-contain"
                  />

                  {}
                  {img.isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {}
                  {!img.isUploading && (
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`${t("agentChat.deleteImage")} ${index + 1}`}
                      title={`${t("agentChat.deleteImage")} ${index + 1}`}
                    >
                      <FaTimes size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CardBody className="flex-1 overflow-hidden p-4 min-h-0">
        {!selectedAgent ? (
          <div className="h-full flex items-center justify-center text-default-500">
            <div className="text-center">
              <FaRobot className="text-6xl mx-auto mb-4 opacity-50" />
              <p>{t("agentChat.selectAgentFirst")}</p>
            </div>
          </div>
        ) : messages.filter((msg) => msg.category === chatCategory).length ===
          0 ? (
          <div className="h-full flex items-center justify-center text-default-500">
            <div className="text-center">
              <p>
                {chatCategory === "image-to-image"
                  ? t("agentChat.noGeneratedImages")
                  : t("agentChat.noGeneratedVideos")}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {messages
                .filter((msg) => msg.category === chatCategory)
                .filter((msg) => msg.type === "agent")
                .map((message) => {
                  
                  const userMessages = messages.filter(
                    (msg) =>
                      msg.type === "user" &&
                      msg.category === message.category &&
                      msg.timestamp < message.timestamp
                  );
                  const userMessage =
                    userMessages.length > 0
                      ? userMessages[userMessages.length - 1]
                      : null;
                  const promptText = userMessage?.content || "";

                  return (
                    <Card
                      key={message.id}
                      className="bg-[#262626] hover:bg-[#303030] transition-colors"
                    >
                      <CardBody className="p-3 space-y-2">
                        {message.taskStatus === "pending" ||
                        message.taskStatus === "processing" ? (
                          
                          <div className="relative rounded overflow-hidden bg-black flex items-center justify-center h-[150px]">
                            <div className="text-center">
                              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                              <span className="text-xs text-white/60">
                                {message.taskStatus === "pending"
                                  ? t("agentChat.generating")
                                  : chatCategory === "image-to-image"
                                    ? t("agentChat.generatingImage")
                                    : t("agentChat.generatingVideo")}
                              </span>
                            </div>
                          </div>
                        ) : message.taskStatus === "completed" &&
                          message.mediaUrls &&
                          message.mediaUrls.length > 0 ? (
                          
                          <>
                            {message.mediaUrls.map((url, index) => (
                              <React.Fragment key={index}>
                                {}
                                <div className="relative rounded overflow-hidden bg-black flex items-center justify-center h-[150px]">
                                  {chatCategory === "image-to-image" ? (
                                    <img
                                      src={url}
                                      alt={`${t("agentChat.generatingImage")} ${index + 1}`}
                                      className="w-auto max-h-full object-contain"
                                    />
                                  ) : (
                                    <video
                                      src={url}
                                      className="w-auto max-h-full object-contain"
                                      autoPlay
                                      loop
                                      muted
                                      playsInline
                                    >
                                      <track kind="captions" />
                                    </video>
                                  )}
                                  {}
                                  <div
                                    role="toolbar"
                                    aria-label={t("agentChat.resourceActions")}
                                    className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                                  >
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      color="primary"
                                      variant="flat"
                                      onPress={() => {
                                        onPreview(
                                          url,
                                          chatCategory === "image-to-image"
                                            ? "image"
                                            : "video"
                                        );
                                      }}
                                    >
                                      <FaExpand size={14} />
                                    </Button>
                                    <Button
                                      isIconOnly
                                      size="sm"
                                      color="primary"
                                      variant="flat"
                                      onPress={() => {
                                        onDownload(
                                          url,
                                          `generated-${index + 1}.${chatCategory === "image-to-image" ? "png" : "mp4"}`
                                        );
                                      }}
                                    >
                                      <FaDownload size={14} />
                                    </Button>
                                    {chatCategory === "image-to-video" && onShare && (
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        color="primary"
                                        variant="flat"
                                        onPress={() => onShare(message.id)}
                                      >
                                        <FaShare size={14} />
                                      </Button>
                                    )}
                                  </div>
                                  {}
                                  <div className="absolute top-1.5 left-1.5">
                                    <Chip
                                      size="sm"
                                      variant="flat"
                                      color="primary"
                                      className="text-xs"
                                    >
                                      {chatCategory === "image-to-image"
                                        ? t("agentChat.image")
                                        : t("agentChat.video")}
                                    </Chip>
                                  </div>
                                </div>

                                {}
                                {promptText && (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-xs font-medium text-default-700 truncate">
                                        {t("agentChat.promptDescription")}
                                      </span>
                                      <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="primary"
                                        onPress={() => {
                                          copyToClipboard(promptText, {
                                            onSuccess: () => {
                                              addToast({
                                                title: t("common.success"),
                                                description: t(
                                                  "agentChat.copyPrompt"
                                                ),
                                                color: "success",
                                                severity: "success",
                                              });
                                            },
                                            onError: () => {
                                              addToast({
                                                title: t("common.copiedFailed"),
                                                description: t(
                                                  "agentChat.copyFailed"
                                                ),
                                                color: "danger",
                                                severity: "danger",
                                              });
                                            },
                                          });
                                        }}
                                        className="flex-shrink-0"
                                      >
                                        <FaCopy size={11} />
                                      </Button>
                                    </div>
                                    <div className="bg-[#1F1F1F] rounded p-1.5 max-h-16 overflow-y-auto">
                                      <p className="text-xs text-default-500 line-clamp-3">
                                        {promptText}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        ) : message.taskStatus === "failed" ? (
                          
                          <div className="relative rounded overflow-hidden bg-black flex items-center justify-center h-[150px]">
                            <div className="text-center text-danger text-sm">
                              {t("agentChat.generateFailed")}
                            </div>
                          </div>
                        ) : null}
                      </CardBody>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </CardBody>

      <Divider className="flex-shrink-0" />

      {}
      <div className="p-4 flex-shrink-0">
        <Button
          size="lg"
          color="primary"
          fullWidth
          onPress={
            chatCategory === "image-to-image" ? onGenerateImage : onGenerateVideo
          }
          isDisabled={
            !selectedAgent ||
            !generatePrompt.trim() ||
            uploadedImages.length === 0
          }
        >
          {chatCategory === "image-to-image"
            ? t("agentChat.generateImage")
            : t("agentChat.generateVideo")}
        </Button>
      </div>
    </Card>
  );
};
