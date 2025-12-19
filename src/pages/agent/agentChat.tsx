import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";
import { SelectItem } from "@heroui/select";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { FaPaperPlane, FaDownload } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import {
  agentApi,
  uploadApi,
  klingAiApi,
  floaAiApi,
  chatApi,
  type DigitalHuman,
  type ChatMessage,
  type UserTrainingTicket,
  type Slot,
} from "@/services";
import { useWalletStore } from "@/stores/useWalletStore";
import { PATHS } from "@/router/paths";
import { useTranslation } from "react-i18next";
import {
  AgentInfoPopover,
  AgentGenerationPanel,
  FireworksAnimation,
} from "@/components/agentChat";
import { useGenerateChatVideo } from "@/hooks/useGenerateChatVideo";
import { useConfigStore } from "@/stores/useConfigStore";
import { useUUID } from "@/hooks/useUUID";
import { ShareToTwitterModal } from "@/components/myCenter/ShareToTwitterModal";


type ChatCategory =
  | "chat"
  | "text-to-image"
  | "text-to-video"
  | "image-to-image"
  | "image-to-video";


type TaskStatus = "pending" | "processing" | "completed" | "failed";

interface Message {
  id: string;
  type: "user" | "agent";
  category: ChatCategory; 
  content: string; 
  timestamp: Date;
  
  mediaUrls?: string[]; 
  taskId?: string; 
  taskStatus?: TaskStatus; 
  isLoading?: boolean; 
  recordId?: number; 
}

interface UploadedImage {
  file: File;
  preview: string;
  url?: string; 
  isUploading?: boolean;
}

const AgentChat: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useWalletStore();
  const { appConfig } = useConfigStore();
  const { generateUUID } = useUUID();

  const [digitalHumans, setDigitalHumans] = useState<DigitalHuman[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<DigitalHuman | null>(null);
  const [agentVideo, setAgentVideo] = useState<string | null>(null);
  const [defaultVideo, setDefaultVideo] = useState<string | null>(null); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState(""); 
  const [generatePrompt, setGeneratePrompt] = useState(""); 
  const [chatCategory, setChatCategory] =
    useState<ChatCategory>("image-to-video"); 
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); 
  const [previewMedia, setPreviewMedia] = useState<{
    url: string;
    type: "image" | "video";
  } | null>(null);
  const [availableTickets, setAvailableTickets] = useState<
    UserTrainingTicket[]
  >([]);
  const [selectedTicket, setSelectedTicket] =
    useState<UserTrainingTicket | null>(null);
  const [agentSlots, setAgentSlots] = useState<Slot[]>([]); 
  const [showFireworks, setShowFireworks] = useState(false); 
  const [shareVideoRecordId, setShareVideoRecordId] = useState<number | null>(null); 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null); 
  const audioQueueRef = useRef<string[]>([]); 
  const isPlayingAudioRef = useRef<boolean>(false); 
  const playedAudioCountRef = useRef<number>(0); 

  
  const pendingVideoDataRef = useRef<{
    recordId: number;
    agentMessageId: string;
  } | null>(null);

  
  const {
    isProcessing: isPaymentProcessing,
    generateChatVideo,
    isTransactionSuccess: isPaymentSuccess,
  } = useGenerateChatVideo({
    onSuccess: () => {
      
      if (pendingVideoDataRef.current) {
        pollVideoRecordStatus(
          pendingVideoDataRef.current.recordId,
          pendingVideoDataRef.current.agentMessageId
        );
        pendingVideoDataRef.current = null;
      }
    },
  });

  
  useEffect(() => {
    if (userInfo && id) {
      
      if (digitalHumans.length > 0) {
        const agent = digitalHumans.find((a) => a.id === Number(id));
        if (agent && agent.id !== selectedAgent?.id) {
          
          
          stopCurrentAudio();
          setSelectedAgent(agent);
          setMessages([]);
          setAgentVideo(null);
          setUploadedImages([]);
          return;
        } else if (agent) {
          
          return;
        }
      }
      
      fetchDigitalHumanById(id);
    } else if (userInfo && !id) {
      
      fetchDigitalHumans();
    }
  }, [id, userInfo]);

  
  useEffect(() => {
    if (digitalHumans.length > 0 && !selectedAgent) {
      setSelectedAgent(digitalHumans[0]);
      if (!id) {
        navigate(`${PATHS.AGENT_CHAT}/${digitalHumans[0].id}`, {
          replace: true,
        });
      }
    }
  }, [digitalHumans]);

  
  useEffect(() => {
    if (selectedAgent) {
      fetchAgentVideo(selectedAgent.id);
      fetchAvailableTickets(selectedAgent.id);
      
      if (selectedAgent.slots && selectedAgent.slots.length > 0) {
        setAgentSlots(selectedAgent.slots as Slot[]);
      }
    }
  }, [selectedAgent]);

  const fetchAgentVideo = async (digitalHumanId: number) => {
    if (!userInfo) return;

    try {
      const response = await agentApi.getDigitalHumanVideoList({
        digitalHumanId: digitalHumanId,
      });

      
      if (response.data.list && response.data.list.length > 0) {
        const videoUrl = response.data.list[0].url;
        setAgentVideo(videoUrl);
        setDefaultVideo(videoUrl); 
      } else {
        setAgentVideo(null);
        setDefaultVideo(null);
      }
    } catch (error) {
      setAgentVideo(null);
      setDefaultVideo(null);
    }
  };

  
  const fetchAvailableTickets = async (digitalHumanId: number) => {
    if (!userInfo) return;

    try {
      const response = await agentApi.getAvailableTrainingTickets({
        digitalHumanId,
      });

      const tickets = response.data.tickets || [];
      setAvailableTickets(tickets);

      
      if (selectedTicket) {
        const stillExists = tickets.find((t) => t.id === selectedTicket.id);
        if (stillExists) {
          
          setSelectedTicket(stillExists);
          return;
        }
      }

      
      if (tickets.length > 0) {
        setSelectedTicket(tickets[0]);
      } else {
        setSelectedTicket(null);
      }
    } catch (error) {
      setAvailableTickets([]);
      setSelectedTicket(null);
    }
  };

  
  const refreshAgentInfo = async () => {
    if (!selectedAgent || !userInfo) return;

    try {
      
      const response = await agentApi.getChatHistoryList({
        page: "1",
        pageSize: "100",
      });

      let chatHistoryList = response.data.list || [];
      
      chatHistoryList = chatHistoryList.map((agent) => {
        if (agent.stats) {
          return {
            ...agent,
            level: agent.stats.level,
            trainingUserCount: agent.stats.trainingUserCount,
            totalTrainingToken: agent.stats.totalTrainingToken,
          };
        }
        return agent;
      });

      
      const updatedAgent = chatHistoryList.find(
        (agent) => agent.id === selectedAgent.id
      );

      if (updatedAgent) {
        
        setSelectedAgent(updatedAgent);

        
        if (updatedAgent.slots) {
          setAgentSlots(updatedAgent.slots as Slot[]);
        }

        
        setDigitalHumans(chatHistoryList);
      } else {
        
        try {
          const currentAgentResponse = await agentApi.getById(selectedAgent.id);
          const currentAgent = currentAgentResponse.data.digitalHuman;

          if (currentAgent) {
            
            if (currentAgent.stats) {
              currentAgent.level = currentAgent.stats.level;
              currentAgent.trainingUserCount =
                currentAgent.stats.trainingUserCount;
              currentAgent.totalTrainingToken =
                currentAgent.stats.totalTrainingToken;
            }

            
            setSelectedAgent(currentAgent);

            
            if (
              currentAgent.activeSlots &&
              currentAgent.activeSlots.length > 0
            ) {
              setAgentSlots(currentAgent.activeSlots as Slot[]);
            } else if (currentAgent.slots) {
              setAgentSlots(currentAgent.slots as Slot[]);
            }

            
            setDigitalHumans([currentAgent, ...chatHistoryList]);
          } else {
            
            setDigitalHumans(chatHistoryList);
          }
        } catch (error) {
          
          setDigitalHumans(chatHistoryList);
        }
      }
    } catch (error) {
  };

  
  const fetchDigitalHumanById = async (digitalHumanId: string) => {
    if (!userInfo) return;

    setIsLoading(true);
    try {
      
      await fetchDigitalHumans();

      
      const agent = digitalHumans.find((a) => a.id === Number(digitalHumanId));
      if (agent) {
        setSelectedAgent(agent);
      }
    } catch (error) {
      addToast({
        title: t("agentChat.getFailed"),
        description: t("agentChat.agentNotFound"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  
  const fetchDigitalHumans = async () => {
    if (!userInfo) return;

    setIsLoading(true);
    try {
      const response = await agentApi.getChatHistoryList({
        page: "1",
        pageSize: "100",
      });

      
      let chatHistoryList = response.data.list || [];

      
      chatHistoryList = chatHistoryList.map((agent) => {
        if (agent.stats) {
          
          return {
            ...agent,
            level: agent.stats.level,
            trainingUserCount: agent.stats.trainingUserCount,
            totalTrainingToken: agent.stats.totalTrainingToken,
          };
        }
        return agent;
      });

      
      if (id) {
        const currentId = Number(id);
        const existingAgent = chatHistoryList.find(
          (agent) => agent.id === currentId
        );

        if (existingAgent) {
          
          chatHistoryList = [
            existingAgent,
            ...chatHistoryList.filter((agent) => agent.id !== currentId),
          ];

          
          if (existingAgent.slots) {
            setAgentSlots(existingAgent.slots as Slot[]);
          }
        } else {
          
          try {
            const currentAgentResponse = await agentApi.getById(currentId);
            const currentAgent = currentAgentResponse.data.digitalHuman;
            if (currentAgent) {
              
              if (currentAgent.stats) {
                currentAgent.level = currentAgent.stats.level;
                currentAgent.trainingUserCount =
                  currentAgent.stats.trainingUserCount;
                currentAgent.totalTrainingToken =
                  currentAgent.stats.totalTrainingToken;
              }

              
              if (
                currentAgent.activeSlots &&
                currentAgent.activeSlots.length > 0
              ) {
                setAgentSlots(currentAgent.activeSlots as Slot[]);
              } else if (currentAgent.slots) {
                setAgentSlots(currentAgent.slots as Slot[]);
              }

              
              chatHistoryList = [currentAgent, ...chatHistoryList];
            }
          } catch (error) {
            
          }
        }
      }

      setDigitalHumans(chatHistoryList);
    } catch (error) {
      addToast({
        title: t("agentChat.getFailed"),
        description: t("agent.noAgents"),
        color: "danger",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  
  const stopCurrentAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  

  
  useEffect(() => {
    return () => {
      
      stopCurrentAudio();
    };
  }, []);

  
  const handleDownload = async (url: string, fileName: string) => {
    
    const isImage = fileName.toLowerCase().match(/\.(png|jpg|jpeg|gif|webp)$/);
    const isVideo = fileName.toLowerCase().match(/\.(mp4|webm|mov)$/);

    if (isImage) {
      
      try {
        const img = new Image();
        img.crossOrigin = "anonymous"; 

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error(t("agentChat.cannotCreateCanvas"));
        }

        ctx.drawImage(img, 0, 0);

        
        canvas.toBlob((blob) => {
          if (!blob) {
            throw new Error(t("agentChat.cannotCreateBlob"));
          }

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
        }, "image/png");
      } catch {
        
        downloadFallback(url, fileName);
      }
    } else if (isVideo) {
      
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
        
        downloadFallback(url, fileName);
      }
    } else {
      
      downloadFallback(url, fileName);
    }
  };

  
  const downloadFallback = (url: string, fileName: string) => {
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
  };

  
  const pollTaskStatus = async (
    taskId: string,
    messageId: string,
    maxAttempts = 60,
    interval = 5000
  ) => {
    let attempts = 0;

    const poll = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, taskStatus: "failed" as TaskStatus }
              : msg
          )
        );
        addToast({
          title: t("agentChat.generationTimeout"),
          description: t("agentChat.taskTooLong"),
          color: "warning",
          severity: "warning",
        });
        setIsGenerating(false);
        return;
      }

      attempts++;

      try {
        const result = await klingAiApi.queryTask(taskId);

        if (result.data.status === 2) {
          
          const mediaUrls = result.data.videos?.map((video) => video.url) || [];

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    taskStatus: "completed" as TaskStatus,
                    mediaUrls,
                  }
                : msg
            )
          );
          setIsGenerating(false);
        } else if (result.data.status === 0 || result.data.status === 1) {
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, taskStatus: "processing" as TaskStatus }
                : msg
            )
          );
          setTimeout(poll, interval);
        } else {
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, taskStatus: "failed" as TaskStatus }
                : msg
            )
          );
          addToast({
            title: t("agentChat.generateFailed"),
            description: result.data.statusMsg || t("agentChat.generateFailed"),
            color: "danger",
            severity: "danger",
          });
          setIsGenerating(false);
        }
      } catch (error) {
        
        setTimeout(poll, interval);
      }
    };

    
    poll();
  };

  
  const handleChatMessage = async (userInput: string) => {
    if (!selectedAgent) return;

    
    if (!selectedTicket) {
      addToast({
        title: t("agentChat.noTrainingTicket"),
        description: t("agentChat.noTrainingTicketDesc"),
        color: "warning",
        severity: "warning",
      });
      setIsSending(false);
      return;
    }

    
    if (selectedTicket.remainingAttempt <= 0) {
      addToast({
        title: t("agentChat.ticketNoAttempts"),
        description: t("agentChat.ticketNoAttemptsDesc"),
        color: "warning",
        severity: "warning",
      });
      setIsSending(false);
      return;
    }

    try {
      
      const chatUUID = generateUUID();

      
      const chatHistory: ChatMessage[] = messages
        .filter((msg) => msg.category === "chat")
        .map((msg) => ({
          role: msg.type === "user" ? "user" : "assistant",
          content: msg.content,
        }));

      
      chatHistory.push({
        role: "user",
        content: userInput,
      });

      
      const agentMessageId = (Date.now() + 1).toString();
      const agentMessage: Message = {
        id: agentMessageId,
        type: "agent",
        category: "chat",
        content: "",
        timestamp: new Date(),
        isLoading: true, 
      };

      setMessages((prev) => [...prev, agentMessage]);

      let fullContent = "";

      
      audioQueueRef.current = [];
      playedAudioCountRef.current = 0;
      isPlayingAudioRef.current = false;

      
      await chatApi.streamCompletions(
        {
          digitalHumanId: selectedAgent.id,
          messages: chatHistory,
          uuid: chatUUID, 
          trainingTicketId: selectedTicket.id, 
          enableTts: true,
          options: {
            temperature: 0.7,
            max_tokens: 2000,
            top_p: 0.9,
            frequency_penalty: 0,
            presence_penalty: 0,
          },
        },
        (chunk) => {
          
          if (chunk.content) {
            fullContent += chunk.content;
            
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === agentMessageId
                  ? { ...msg, content: fullContent, isLoading: false }
                  : msg
              )
            );
          }

          
          if (chunk.audio) {
            audioQueueRef.current.push(chunk.audio);
            
            playNextAudioInQueue();
          }
        },
        () => {
          addToast({
            title: t("agentChat.chatFailed"),
            
            color: "danger",
            severity: "danger",
          });
          setIsSending(false);
        },
        () => {
          
          setIsSending(false);

          

          
          if (fullContent) {
            recognizeEmotionAndUpdateVideo(fullContent, chatUUID);
          }

          
          if (selectedAgent) {
            fetchAvailableTickets(selectedAgent.id);
          }
        }
      );
    } catch {
      addToast({
        title: t("agentChat.chatFailed"),
        description: t("agentChat.sendFailedDesc"),
        color: "danger",
        severity: "danger",
      });
      setIsSending(false);
    }
  };

  
  const playNextAudioInQueue = async () => {
    
    if (isPlayingAudioRef.current) {
      return;
    }

    
    if (playedAudioCountRef.current >= audioQueueRef.current.length) {
      return;
    }

    
    isPlayingAudioRef.current = true;

    
    const nextAudio = audioQueueRef.current[playedAudioCountRef.current];
    playedAudioCountRef.current++;

    try {
      await playAudioFromBase64(nextAudio);
    } catch {
      
    }

    
    isPlayingAudioRef.current = false;

    
    playNextAudioInQueue();
  };

  
  const playAudioFromBase64 = (base64Audio: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        0.0;
        
        stopCurrentAudio();

        
        const binaryString = window.atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: "audio/wav" });

        
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);

        
        currentAudioRef.current = audio;

        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          if (currentAudioRef.current === audio) {
            currentAudioRef.current = null;
          }
          resolve();
        };

        
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          if (currentAudioRef.current === audio) {
            currentAudioRef.current = null;
          }
          reject();
        };

        audio.play();
      } catch (error) {
        reject(error);
      }
    });
  };

  
  const recognizeEmotionAndUpdateVideo = async (
    _message: string,
    uuid: string
  ) => {
    if (!selectedAgent || !userInfo || !selectedTicket) return;

    try {
      
      const emotionResponse = await agentApi.recognizeEmotion({
        digitalHumanId: selectedAgent.id, 
        uuid: uuid, 
      });

      
      if (emotionResponse.data.videoUrl) {
        const videoUrl = emotionResponse.data.videoUrl;

        
        const tempVideo = document.createElement("video");
        tempVideo.preload = "auto";
        tempVideo.src = videoUrl;

        
        tempVideo.oncanplaythrough = () => {
          setAgentVideo(videoUrl);
          
          setShowFireworks(true);
          
          tempVideo.remove();
        };

        
        tempVideo.onerror = () => {
          tempVideo.remove();
        };

        
        tempVideo.load();
      }
      
    } catch {
      
    }
  };

  
  const handleImageToImage = async (prompt: string, imageUrls: string[]) => {
    if (!selectedAgent) return;

    try {
      let taskResponse;
      if (imageUrls.length === 1) {
        
        taskResponse = await klingAiApi.textToImage({
          prompt,
          image: imageUrls[0],
          digitalHumanId: selectedAgent.id,
          createType: 3,
        });
      } else {
        
        taskResponse = await klingAiApi.multiImageToImage({
          prompt,
          digitalHumanId: selectedAgent.id,
          subjectImageList: imageUrls.map((url) => ({
            subject_image: url,
          })),
        });
      }

      return taskResponse.data.taskId;
    } catch (error) {
      throw error;
    }
  };

  
  const handleSendChatMessage = async () => {
    
    if (!inputMessage.trim() || !selectedAgent) return;

    
    const hasLockedSlots = agentSlots.some((slot) => slot.lock === 1);
    if (!hasLockedSlots) {
      addToast({
        title: t("common.hint"),
        description: t("agentChat.noLockedSlots"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    const prompt = inputMessage;

    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      category: "chat",
      content: prompt,
      timestamp: new Date(),
    };

    
    setMessages((prev) => [...prev, userMessage]);

    
    setInputMessage("");

    
    setIsSending(true);

    try {
      
      await handleChatMessage(prompt);
    } catch (error) {
      addToast({
        title: t("agentChat.sendFailed"),
        description: t("agentChat.sendFailedDesc"),
        color: "danger",
        severity: "danger",
      });
      setIsSending(false);
    }
  };

  
  const handleGenerateImage = async () => {
    
    if (!generatePrompt.trim() || !selectedAgent) return;

    if (uploadedImages.length === 0) {
      addToast({
        title: t("agentChat.imageRequired"),
        description: t("agentChat.imageRequiredDesc"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    const hasUploadingImages = uploadedImages.some((img) => img.isUploading);
    if (hasUploadingImages) {
      addToast({
        title: t("common.loading"),
        description: t("agentChat.imageUploading"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    const prompt = generatePrompt;
    const imageUrls = uploadedImages
      .map((img) => img.url)
      .filter((url): url is string => !!url);


    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      category: "image-to-image",
      content: prompt,
      timestamp: new Date(),
      mediaUrls: imageUrls,
    };

    setMessages((prev) => [...prev, userMessage]);

    
    setGeneratePrompt("");
    setUploadedImages([]);
    setIsGenerating(true);

    try {
      
      const taskId = await handleImageToImage(prompt, imageUrls);

      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        category: "image-to-image",
        content: "",
        timestamp: new Date(),
        taskId,
        taskStatus: "pending",
        mediaUrls: [],
      };

      setMessages((prev) => [...prev, agentMessage]);

      
      pollTaskStatus(taskId, agentMessage.id);
    } catch (error) {
      addToast({
        title: t("agentChat.generateFailed"),
        description: t("agentChat.sendFailedDesc"),
        color: "danger",
        severity: "danger",
      });
    }
  };

  
  const pollVideoRecordStatus = async (
    recordId: number,
    messageId: string,
    interval = 5000
  ) => {
    const poll = async (): Promise<void> => {
      try {
        const result = await agentApi.getChatIdVideoRecords(recordId);

        
        if (result.data && result.data.record) {
          const record = result.data.record;

          
          if (record.task.status === 2 && record.task.url) {
            
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? {
                      ...msg,
                      taskStatus: "completed" as TaskStatus,
                      mediaUrls: [record.task.url!],
                      recordId: recordId,
                    }
                  : msg
              )
            );
            setIsGenerating(false);
            return; 
          } else if (record.task.status === 3) {
            
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? { ...msg, taskStatus: "failed" as TaskStatus }
                  : msg
              )
            );
            setIsGenerating(false);
            return; 
          } else {
            
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? { ...msg, taskStatus: "processing" as TaskStatus }
                  : msg
              )
            );
            setTimeout(poll, interval);
          }
        } else {
          
          setTimeout(poll, interval);
        }
      } catch {
        
        setTimeout(poll, interval);
      }
    };

    poll();
  };

  
  const handleGenerateVideo = async () => {
    
    if (!generatePrompt.trim() || !selectedAgent) return;

    if (uploadedImages.length === 0) {
      addToast({
        title: t("agentChat.imageRequired"),
        description: t("agentChat.imageRequiredDesc"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    const hasUploadingImages = uploadedImages.some((img) => img.isUploading);
    if (hasUploadingImages) {
      addToast({
        title: t("common.loading"),
        description: t("agentChat.imageUploading"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    if (agentSlots.length === 0) {
      addToast({
        title: t("agentChat.noSlot"),
        description: t("agentChat.noSlotDesc"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    const activeSlot = agentSlots.find((slot) => slot.status === 1);
    if (!activeSlot) {
      addToast({
        title: t("agentChat.noActiveSlot"),
        description: t("agentChat.noActiveSlotDesc"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    const prompt = generatePrompt;
    const imageUrls = uploadedImages
      .map((img) => img.url)
      .filter((url): url is string => !!url);

    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      category: "image-to-video",
      content: prompt,
      timestamp: new Date(),
      mediaUrls: imageUrls,
    };

    setMessages((prev) => [...prev, userMessage]);

    
    setGeneratePrompt("");
    setUploadedImages([]);

    
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "agent",
      category: "image-to-video",
      content: "",
      timestamp: new Date(),
      taskStatus: "pending",
      mediaUrls: [],
    };

    setMessages((prev) => [...prev, agentMessage]);
    setIsGenerating(true);

    try {
      
      const videoResponse = await floaAiApi.imageToVideo({
        prompt,
        negativePrompt:
          "模糊，、手脚虚化、变形、毁容、低质量、拼贴、粒状、标准、穿模、抽象、插图、计算机生成、扭曲",
        image: imageUrls[0], 
        digitalHumanId: selectedAgent.id,
        createType: "3",
      });

      
      const recordId = Number(videoResponse.data.recordId);

      
      pendingVideoDataRef.current = {
        recordId,
        agentMessageId: agentMessage.id,
      };

      
      await generateChatVideo({
        amount: appConfig?.generationPrice || "0", 
        slotId: activeSlot.id,
        avatarId: selectedAgent.id,
        level: activeSlot.digitalHumanLevel || 1,
        recordId: recordId.toString(), 
      });
    } catch (error: any) {
      
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMessage.id
            ? { ...msg, taskStatus: "failed" as TaskStatus }
            : msg
        )
      );
      setIsGenerating(false);
      pendingVideoDataRef.current = null;

      addToast({
        title: t("agentChat.generateFailed"),
        description: error?.message || t("agentChat.sendFailedDesc"),
        color: "danger",
        severity: "danger",
      });
    }
  };

  const handleSelectAgent = (agent: DigitalHuman) => {
    
    if (selectedAgent?.id === agent.id) {
      return;
    }

    
    stopCurrentAudio();

    setSelectedAgent(agent);
    setMessages([]);
    setAgentVideo(null);
    setUploadedImages([]);
    
    navigate(`${PATHS.AGENT_CHAT}/${agent.id}`, { replace: true });
  };

  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      addToast({
        title: t("agentChat.uploadFailed"),
        description: t("agentChat.invalidImageType"),
        color: "danger",
        severity: "danger",
      });
      return;
    }

    
    uploadedImages.forEach((img) => {
      URL.revokeObjectURL(img.preview);
    });

    
    const preview = URL.createObjectURL(file);
    const newImage: UploadedImage = { file, preview, isUploading: true };

    
    setUploadedImages([newImage]);

    try {
      const response = await uploadApi.uploadFile(file);
      
      setUploadedImages([
        {
          file,
          preview,
          url: response.data.fileUrl,
          isUploading: false,
        },
      ]);
    } catch (error) {
      addToast({
        title: t("agentChat.uploadFailed"),
        description: file.name,
        color: "danger",
        severity: "danger",
      });

      
      setUploadedImages([]);
      URL.revokeObjectURL(preview);
    }

    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  
  const handleShareVideo = (messageId: string) => {
    
    if (!userInfo?.twitterUser) {
      addToast({
        title: t("myCreations.bindTwitterFirst"),
        description: t("myCreations.bindTwitterDesc"),
        color: "warning",
        severity: "warning",
      });
      return;
    }

    
    const message = messages.find((msg) => msg.id === messageId);
    if (!message || !message.recordId) {
      addToast({
        title: t("common.error"),
        description: t("agentChat.videoNotFound"),
        color: "danger",
        severity: "danger",
      });
      return;
    }

    
    setShareVideoRecordId(message.recordId);
  };

  return (
    <div className="h-[calc(100vh-64px)] p-4">
      <div className="max-w-[1800px] mx-auto h-full">
        <div className="grid gap-4 h-full grid-cols-6">
          {}
          <div className="col-span-1 h-full overflow-y-auto">
            <Card className="h-full bg-[#1F1F1F] backdrop-blur-sm flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
                <h2 className="text-xl font-bold text-default-900">
                  {t("agentChat.title")}
                </h2>
              </CardHeader>
              <Divider className="flex-shrink-0" />
              <CardBody className="overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="text-center text-default-500 py-8">
                    {t("common.loading")}
                  </div>
                ) : digitalHumans.length === 0 ? (
                  <div className="text-center text-default-500 py-8">
                    {t("agent.noAgents")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {digitalHumans.map((agent) => (
                      <Card
                        key={agent.id}
                        isPressable
                        isHoverable
                        className={`w-full cursor-pointer transition-all ${
                          selectedAgent?.id === agent.id
                            ? "bg-primary/20 border-2 border-primary"
                            : "bg-[#303030] border-2 border-[#303030] hover:bg-[#1a1f35]"
                        }`}
                        onPress={() => handleSelectAgent(agent)}
                      >
                        <CardBody className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar
                                src={agent.avatarUrl}
                                size="md"
                                name={agent.name}
                                isBordered={selectedAgent?.id === agent.id}
                                color={
                                  selectedAgent?.id === agent.id
                                    ? "primary"
                                    : "default"
                                }
                              />
                              {Boolean(agent.isVerify) && (
                                <div className="absolute -bottom-1 -right-1 bg-black/50 rounded-full p-0.5">
                                  <MdVerified className="text-blue-500 text-sm" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm truncate">
                                {agent.name}
                              </p>
                              <p className="text-xs text-default-500 truncate">
                                {agent.personalityType}
                              </p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {}
          <div className="col-span-3 h-full">
            <Card className="h-full bg-[#1F1F1F] backdrop-blur-sm flex flex-col">
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    {selectedAgent && (
                      <>
                        <AgentInfoPopover
                          agent={selectedAgent}
                          slots={agentSlots}
                          onRefresh={refreshAgentInfo}
                        />
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-lg font-bold text-default-900">
                            {selectedAgent.name}
                          </h2>
                          {selectedAgent.level &&
                            selectedAgent.level >= 1 &&
                            selectedAgent.level <= 6 && (
                              <>
                                <img
                                  src={`/img/level/lv-${selectedAgent.level}.png`}
                                  alt={`Level ${selectedAgent.level}`}
                                  className="w-6 h-6 object-contain"
                                />
                                <span className="text-xs text-default-500">
                                  Level {selectedAgent.level}
                                </span>
                              </>
                            )}

                          {}
                          {selectedAgent.user?.twitterUsername && (
                            <a
                              href={`https://twitter.com/${selectedAgent.user.twitterUsername}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaXTwitter className="text-sm" />
                              <span>@{selectedAgent.user.twitterUsername}</span>
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {}
                  {selectedAgent && (
                    <div className="flex items-center gap-3">
                      {availableTickets.length > 0 ? (
                        <CustomSelect
                          labelPlacement="outside-left"
                          label={t("agentChat.selectTrainingTicket")}
                          placeholder={t("agentChat.selectTrainingTicket")}
                          selectedKeys={
                            selectedTicket
                              ? new Set([selectedTicket.id.toString()])
                              : new Set([])
                          }
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0];
                            if (selectedKey) {
                              const ticketId = Number(selectedKey);
                              const ticket = availableTickets.find(
                                (t) => t.id === ticketId
                              );
                              if (ticket) {
                                setSelectedTicket(ticket);
                              }
                            }
                          }}
                          size="sm"
                          className="w-80"
                          renderValue={(items) => {
                            const item = items[0];
                            if (!item) return null;
                            const ticket = availableTickets.find(
                              (t) => t.id.toString() === item.key
                            );
                            if (!ticket) return null;
                            return (
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  {ticket.ticketLevel >= 1 &&
                                    ticket.ticketLevel <= 6 && (
                                      <img
                                        src={`/img/level/tickets-${ticket.ticketLevel}.png`}
                                        alt={`Level ${ticket.ticketLevel}`}
                                        className="w-5 h-5 object-contain"
                                      />
                                    )}
                                  <span>Lv.{ticket.ticketLevel}</span>
                                  <span>#{ticket.id}</span>
                                </div>
                                <span>
                                  {ticket.todaySuccessCount}/
                                  {ticket.remainingAttempt}/
                                  {ticket.dailyMaxAttempt}
                                </span>
                              </div>
                            );
                          }}
                        >
                          {availableTickets.map((ticket) => (
                            <SelectItem
                              key={ticket.id.toString()}
                              value={ticket.id.toString()}
                              textValue={`#${ticket.id} Lv.${ticket.ticketLevel} ${ticket.remainingAttempt}`}
                            >
                              <div className="flex flex-col">
                                {ticket.ticketLevel >= 1 &&
                                ticket.ticketLevel <= 6 ? (
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={`/img/level/tickets-${ticket.ticketLevel}.png`}
                                      alt={`Level ${ticket.ticketLevel}`}
                                      className="w-6 h-6 object-contain"
                                    />
                                    <span className="text-sm font-bold">
                                      Lv.{ticket.ticketLevel}
                                    </span>
                                    <span>#{ticket.id}</span>
                                  </div>
                                ) : null}
                                <div className="text-xs">
                                  {t("agentChat.ticketSuccess")}：
                                  {ticket.todaySuccessCount}
                                  <br />
                                  {t("agentChat.ticketRemaining")}：
                                  {ticket.remainingAttempt}
                                  <br />
                                  {t("agentChat.ticketMaxAttempts")}：
                                  {ticket.dailyMaxAttempt}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </CustomSelect>
                      ) : (
                        
                        <div className="flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/30 rounded-lg">
                          <span className="text-sm text-warning">
                            {t("agentChat.noTicketsGuidance")}
                          </span>
                          <Button
                            size="sm"
                            color="warning"
                            variant="flat"
                            onPress={() => navigate(PATHS.SHOPPING_MALL)}
                          >
                            {t("agentChat.goToPurchase")}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <Divider className="flex-shrink-0" />

              <CardBody className="overflow-y-auto flex-1 p-4 relative">
                {!selectedAgent ? (
                  <div className="h-full flex items-center justify-center text-default-500">
                    <div className="text-center">
                      <p>{t("agentChat.selectAgent")}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {}
                    <div className="h-full flex items-center justify-center">
                      <div className="max-w-[60%] max-h-[70vh] overflow-hidden">
                        {agentVideo ? (
                          <video
                            ref={videoRef}
                            src={agentVideo}
                            className="w-auto max-h-[70vh]"
                            autoPlay
                            loop={agentVideo === defaultVideo}
                            muted
                            playsInline
                            onEnded={() => {
                              if (agentVideo !== defaultVideo && defaultVideo) {
                                setAgentVideo(defaultVideo);
                              }
                            }}
                            style={{ aspectRatio: "1148/1480" }}
                          />
                        ) : (
                          <img
                            src={
                              selectedAgent.imageUrl || selectedAgent.avatarUrl
                            }
                            alt={selectedAgent.name}
                            className="w-full rounded-lg object-cover"
                            style={{ aspectRatio: "1148/1480" }}
                          />
                        )}
                      </div>
                    </div>

                    {}
                    {messages.filter((msg) => msg.category === "chat").length >
                      0 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[80%] bg-[#262626]/60  rounded-lg p-4 shadow-lg">
                        {(() => {
                          const latestMessage = messages
                            .filter((msg) => msg.category === "chat")
                            .slice(-1)[0];
                          if (!latestMessage) return null;

                          return (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <Avatar
                                    src={
                                      latestMessage.type === "user"
                                        ? userInfo?.avatar
                                        : selectedAgent.avatarUrl
                                    }
                                    size="sm"
                                    name={
                                      latestMessage.type === "user"
                                        ? userInfo?.username
                                        : selectedAgent.name
                                    }
                                  />
                                  {latestMessage.type === "agent" &&
                                    Boolean(selectedAgent.isVerify) && (
                                      <div className="absolute z-10 -bottom-0.5 -right-0.5 bg-black/50 rounded-full p-0.5">
                                        <MdVerified className="text-blue-500 text-xs" />
                                      </div>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-white">
                                  {latestMessage.type === "user"
                                    ? userInfo?.username
                                    : selectedAgent.name}
                                </span>
                              </div>
                              {latestMessage.isLoading ? (
                                <div className="flex items-center gap-2 text-white/60">
                                  <Spinner size="sm" color="default" />
                                  <span className="text-xs">
                                    {t("agentChat.aiThinking")}
                                  </span>
                                </div>
                              ) : (
                                <p className="text-sm text-white/90 whitespace-pre-wrap break-words">
                                  {latestMessage.content}
                                </p>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}
              </CardBody>

              <Divider className="flex-shrink-0" />

              <div className="p-4 flex-shrink-0">
                {}
                {!userInfo ? (
                  
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 border border-primary/30 rounded-lg">
                    <span className="text-sm text-primary">
                      {t("agentChat.connectWalletToChat")}
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      variant="bordered"
                      type="text"
                      labelPlacement="outside"
                      placeholder={
                        selectedAgent
                          ? `${t("agentChat.send")} ${selectedAgent.name}...`
                          : t("agent.noAgents")
                      }
                      value={inputMessage}
                      onValueChange={setInputMessage}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChatMessage();
                        }
                      }}
                      disabled={!selectedAgent || isSending}
                      size="lg"
                    />

                    <Button
                      color="primary"
                      isIconOnly
                      size="lg"
                      onPress={handleSendChatMessage}
                      isDisabled={
                        !selectedAgent || !inputMessage.trim() || isSending
                      }
                      isLoading={isSending}
                    >
                      <FaPaperPlane />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="col-span-2 h-full overflow-hidden">
            <AgentGenerationPanel
              selectedAgent={selectedAgent}
              userInfo={userInfo}
              chatCategory={chatCategory as "image-to-image" | "image-to-video"}
              onChatCategoryChange={(category) => setChatCategory(category)}
              generatePrompt={generatePrompt}
              onGeneratePromptChange={setGeneratePrompt}
              uploadedImages={uploadedImages}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
              messages={messages}
              isSending={isGenerating}
              onGenerateImage={handleGenerateImage}
              onGenerateVideo={handleGenerateVideo}
              onDownload={handleDownload}
              onPreview={(url, type) => setPreviewMedia({ url, type })}
              onShare={handleShareVideo}
            />
          </div>
        </div>
      </div>

      {}
      <Modal
        isOpen={!!previewMedia}
        onClose={() => setPreviewMedia(null)}
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
                <span>{t("agentChat.mediaPreview")}</span>
              </ModalHeader>
              <ModalBody>
                {previewMedia?.type === "image" ? (
                  <img
                    src={previewMedia.url}
                    alt={t("agentChat.preview")}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                ) : previewMedia?.type === "video" ? (
                  <video
                    src={previewMedia.url}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[70vh]"
                  >
                    <track kind="captions" />
                  </video>
                ) : null}
              </ModalBody>
              <ModalFooter className="justify-center gap-4">
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    if (previewMedia) {
                      handleDownload(
                        previewMedia.url,
                        `download.${previewMedia.type === "video" ? "mp4" : "png"}`
                      );
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
      <FireworksAnimation
        isVisible={showFireworks}
        duration={5000}
        onComplete={() => setShowFireworks(false)}
      />

      {}
      <ShareToTwitterModal
        isOpen={!!shareVideoRecordId}
        onClose={() => setShareVideoRecordId(null)}
        videoId={shareVideoRecordId || 0}
        onSuccess={() => {
          
        }}
      />
    </div>
  );
};

export default AgentChat;
