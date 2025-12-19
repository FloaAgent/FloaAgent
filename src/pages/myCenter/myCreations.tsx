import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Pagination } from "@heroui/pagination";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { FaDownload, FaExpand, FaCopy, FaVideo, FaShare } from "react-icons/fa";
import { agentApi, type TaskResource } from "@/services";
import { useWalletStore } from "@/stores/useWalletStore";
import { ShareToTwitterModal } from "@/components/myCenter/ShareToTwitterModal";
import { useNavigate } from "react-router-dom";
import { copyToClipboard as copyText } from "@/utils/copyToClipboard";


const MyCreationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userInfo } = useWalletStore();
  const [videoList, setVideoList] = useState<TaskResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [shareVideoId, setShareVideoId] = useState<number | null>(null);
  const pageSize = 50;

  
  const fetchVideoList = async (page: number = 1) => {
    if (!userInfo) return;

    setIsLoading(true);
    try {
      const response = await agentApi.getTaskList({
        page,
        pageSize,
      });

      setVideoList(response.data.list || []);
      const total = response.data.total || 0;
      setTotalCount(total);
      setTotalPages(Math.ceil(total / pageSize));
    } catch (error) {
      addToast({
        title: t("agentChat.getFailed"),
        description: t("agentChat.getResourcesFailed"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchVideoList(page);
  };

  
  const extractPrompt = (promptContent?: string): string => {
    if (!promptContent) return "";
    try {
      const params = JSON.parse(promptContent);
      return params.prompt || "";
    } catch {
      return "";
    }
  };

  
  const copyToClipboard = (text: string, label: string) => {
    copyText(text, {
      onSuccess: () => {
        addToast({
          title: t("common.copiedSuccess"),
          description: `${label}`,
          color: "success",
          severity: "success",
        });
      },
      onError: () => {
        addToast({
          title: t("common.copiedFailed"),
          description: t("agentChat.copyFailed"),
          color: "danger",
          severity: "danger",
        });
      },
    });
  };

  
  const handleShare = (videoId: number) => {
    
    if (!userInfo?.twitterUser) {
      addToast({
        title: t("myCreations.bindTwitterFirst"),
        description: t("myCreations.bindTwitterDesc"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    setShareVideoId(videoId);
  };

  
  const handleDownload = async (url: string, fileName: string) => {
    try {
      const response = await fetch(url, {
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error("Fetch failed");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      addToast({
        title: t("agentChat.downloadSuccess"),
        description: `${fileName}`,
        color: "success",
        severity: "success",
      });
    } catch {
      
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: t("agentChat.downloadSuccess"),
        description: t("common.download"),
        color: "primary",
        severity: "primary",
      });
    }
  };

  
  const getStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return t("agentChat.submitted");
      case 1:
        return t("agentChat.processing");
      case 2:
        return t("agentChat.completed");
      case 3:
        return t("agentChat.failed");
      case 9999:
        return t("agentChat.queued");
      default:
        return t("agentChat.unknown");
    }
  };

  
  const getStatusColor = (
    status: number
  ): "warning" | "danger" | "success" | "default" | "primary" => {
    switch (status) {
      case 0:
        return "primary"; 
      case 1:
        return "warning"; 
      case 2:
        return "success"; 
      case 3:
        return "danger"; 
      case 9999:
        return "default"; 
      default:
        return "default";
    }
  };

  
  useEffect(() => {
    if (userInfo) {
      fetchVideoList(currentPage);
    }
  }, [userInfo]);

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      {}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-[1px] border-b-primary/30">
        <h1 className="text-primary text-xl font-bold">
          {t("myCreations.title")}（{totalCount}）
        </h1>
      </div>

      {}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Spinner size="lg" color="primary" />
          </div>
        ) : videoList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 px-6">
            {}
            <div className="relative mb-8">
              {}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-500/20 rounded-full blur-3xl scale-150" />

              {}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-400/10 to-blue-500/10 border-2 border-purple-400/30 flex items-center justify-center">
                <FaVideo className="w-16 h-16 text-purple-400/60" />
              </div>
            </div>

            {}
            <h3 className="text-2xl font-bold text-white/80 mb-3 font-w-black-italic">
              {t("myCreations.noVideos")}
            </h3>
            <p className="text-white/50 text-base max-w-md text-center leading-relaxed">
              {t("myCreations.noVideosDesc")}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 gap-2">
              {videoList.map((video) => {
                const prompt = extractPrompt(video.promptContent);
                const hasVideo = video.task.status === 2 && video.task.url;

                return (
                  <Card
                    key={video.id}
                    className="bg-[#262626] hover:bg-[#303030] transition-colors"
                  >
                    <CardBody className="p-3 space-y-2">
                      {}
                      <div className="relative rounded overflow-hidden bg-black flex items-center justify-center">
                        {hasVideo ? (
                          <video
                            src={video.task.url}
                            className="w-auto max-h-full object-contain"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ aspectRatio: "1148/1480" }}
                          >
                            <track kind="captions" />
                          </video>
                        ) : (
                          
                          <div className="w-full h-full flex items-center justify-center">
                            {video.imageUrl ? (
                              <img
                                src={video.imageUrl}
                                alt={`${video.id}`}
                                className="w-auto max-h-full object-contain opacity-50"
                                style={{ aspectRatio: "1148/1480" }}
                              />
                            ) : (
                              <Spinner size="lg" color="primary" />
                            )}
                          </div>
                        )}

                        {}
                        {hasVideo && (
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
                              onPress={() => setPreviewVideo(video.task.url!)}
                            >
                              <FaExpand size={14} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              color="primary"
                              variant="flat"
                              onPress={() =>
                                handleDownload(
                                  video.task.url!,
                                  `video-${video.id}.mp4`
                                )
                              }
                            >
                              <FaDownload size={14} />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              color="primary"
                              variant="flat"
                              onPress={() => handleShare(video.id)}
                            >
                              <FaShare size={14} />
                            </Button>
                          </div>
                        )}

                        {}
                        <div className="absolute top-1.5 left-1.5">
                          <Chip
                            size="sm"
                            variant="flat"
                            color={getStatusColor(video.task.status)}
                            className="text-xs"
                          >
                            {getStatusText(video.task.status)}
                          </Chip>
                        </div>
                      </div>

                      {}
                      {prompt && (
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
                              onPress={() =>
                                copyToClipboard(
                                  prompt,
                                  t("agentChat.promptDescription")
                                )
                              }
                              className="flex-shrink-0"
                            >
                              <FaCopy size={11} />
                            </Button>
                          </div>
                          <div className="bg-[#1F1F1F] rounded p-1.5 max-h-16 overflow-y-auto">
                            <p className="text-xs text-default-500 line-clamp-3">
                              {prompt}
                            </p>
                          </div>
                        </div>
                      )}

                      {}
                      <div className="text-xs text-default-500 pt-1 border-t border-default-200/10">
                        <div className="flex justify-between items-center">
                          <span className="truncate">ID: {video.id}</span>
                          <span className="text-[10px] whitespace-nowrap ml-2">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>

            {}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 pb-4">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  showControls
                  color="primary"
                />
              </div>
            )}
          </>
        )}
      </div>

      {}
      <Modal
        isOpen={!!previewVideo}
        onClose={() => setPreviewVideo(null)}
        size="5xl"
        classNames={{
          base: "bg-[#1F1F1F]",
          backdrop: "bg-black/80",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {}
              </ModalHeader>
              <ModalBody>
                {previewVideo && (
                  <video
                    src={previewVideo}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[70vh]"
                  >
                    <track kind="captions" />
                  </video>
                )}
              </ModalBody>
              <ModalFooter className="justify-center gap-4">
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    if (previewVideo) {
                      handleDownload(previewVideo, `download.mp4`);
                    }
                  }}
                >
                  <FaDownload />
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("agentChat.close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {}
      <ShareToTwitterModal
        isOpen={!!shareVideoId}
        onClose={() => setShareVideoId(null)}
        videoId={shareVideoId || 0}
        onSuccess={() => {
          
        }}
      />
    </div>
  );
};

export default MyCreationsPage;
