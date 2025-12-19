import React, { useRef, useState } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Slider } from "@heroui/slider";
import { addToast } from "@heroui/toast";
import { uploadApi } from "@/services";
import { useTranslation } from "react-i18next";

export interface CropResult {
  file: File;
  preview: string;
  uploadedUrl: string;
}

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (result: CropResult) => void;
  aspectRatio?: number;
  targetWidth?: number;
  targetHeight?: number;
  cropShape?: "rect" | "round";
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio = 1, 
  targetWidth = 300,
  targetHeight = 300,
  cropShape = "rect",
}) => {
  const { t } = useTranslation();
  const cropperRef = useRef<ReactCropperElement>(null);
  const [zoom, setZoom] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleZoomChange = (value: number | number[]) => {
    const zoomValue = typeof value === "number" ? value : value[0];
    setZoom(zoomValue);
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      
      cropper.zoomTo(zoomValue);
    }
  };

  const handleConfirm = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    setIsProcessing(true);
    try {
      
      const canvas = cropper.getCroppedCanvas({
        width: targetWidth,
        height: targetHeight,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      
      let finalCanvas = canvas;
      if (cropShape === "round") {
        finalCanvas = getRoundedCanvas(canvas);
      }

      
      finalCanvas.toBlob(
        async (blob) => {
          if (blob) {
            try {
              
              const file = new File([blob], `cropped-${Date.now()}.jpg`, {
                type: "image/jpeg",
              });

              
              const uploadResponse = await uploadApi.uploadFile(file);
              const uploadedUrl = uploadResponse.data.fileUrl;

              
              const previewUrl = URL.createObjectURL(file);

              
              onCropComplete({
                file,
                preview: previewUrl,
                uploadedUrl,
              });

              addToast({
                title: t("imageCrop.uploadSuccess"),
                description: t("imageCrop.uploadSuccessDesc"),
                color: "primary",
                severity: "success",
              });

              onClose();
            } catch (error: any) {
              const errorMessage = error?.message || t("imageCrop.uploadFailedDesc");
              addToast({
                title: t("imageCrop.uploadFailed"),
                description: errorMessage,
                color: "danger",
                severity: "danger",
              });
            }
          }
          setIsProcessing(false);
        },
        "image/jpeg",
        0.95
      );
    } catch (error: any) {
      const errorMessage = error?.message || t("imageCrop.processFailedDesc");
      addToast({
        title: t("imageCrop.processFailed"),
        description: errorMessage,
        color: "danger",
        severity: "danger",
      });
      setIsProcessing(false);
    }
  };

  
  const getRoundedCanvas = (sourceCanvas: HTMLCanvasElement) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const width = sourceCanvas.width;
    const height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.drawImage(sourceCanvas, 0, 0, width, height);
      context.globalCompositeOperation = "destination-in";
      context.beginPath();
      context.arc(
        width / 2,
        height / 2,
        Math.min(width, height) / 2,
        0,
        2 * Math.PI,
        true
      );
      context.fill();
    }

    return canvas;
  };

  const handleCancel = () => {
    setZoom(0);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      size="2xl"
      classNames={{
        base: "bg-content1",
        backdrop: "bg-black/50",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{t("imageCrop.title")}</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {}
            <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
              <Cropper
                ref={cropperRef}
                src={imageSrc}
                style={{ height: "100%", width: "100%" }}
                aspectRatio={aspectRatio}
                viewMode={1}
                guides={true}
                background={false}
                responsive={true}
                checkOrientation={false}
                center={true}
                highlight={false}
                dragMode="move"
                cropBoxMovable={false}
                cropBoxResizable={false}
                toggleDragModeOnDblclick={false}
                minCropBoxWidth={100}
                minCropBoxHeight={100}
                ready={() => {
                  
                  const cropper = cropperRef.current?.cropper;
                  if (cropper) {
                    const containerData = cropper.getContainerData();
                    const cropBoxData = cropper.getCropBoxData();

                    
                    const left = (containerData.width - cropBoxData.width) / 2;
                    const top = (containerData.height - cropBoxData.height) / 2;

                    cropper.setCropBoxData({
                      left,
                      top,
                      width: cropBoxData.width,
                      height: cropBoxData.height,
                    });
                  }
                }}
              />
            </div>

            {}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("imageCrop.zoom")}</label>
              <Slider
                size="sm"
                step={0.1}
                minValue={0}
                maxValue={1}
                value={zoom}
                onChange={handleZoomChange}
                className="max-w-full"
                aria-label={t("imageCrop.zoomAriaLabel")}
              />
            </div>

            <p className="text-xs text-default-500 text-center">
              {t("imageCrop.cropSize", { width: targetWidth, height: targetHeight })}
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={handleCancel}
            isDisabled={isProcessing}
            className="text-default-500"
          >
            {t("imageCrop.cancel")}
          </Button>
          <Button
            color="primary"
            onPress={handleConfirm}
            isLoading={isProcessing}
          >
            {t("imageCrop.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ImageCropModal;
