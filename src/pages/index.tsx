"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  MdUpload,
  MdDownload,
  MdRefresh,
  MdCrop,
  MdClose,
  MdDeleteForever,
} from "react-icons/md";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageItem {
  id: string;
  src: string;
  name: string;
  cropArea: CropArea;
  croppedSrc: string | null;
  originalWidth: number;
  originalHeight: number;
}

// MessageModal component removed as per user request to remove popups.
// const MessageModal: React.FC<{ message: string; onClose: () => void; autoClose?: boolean }> = ({ message, onClose, autoClose }) => {
//   useEffect(() => {
//     if (autoClose) {
//       const timer = setTimeout(() => {
//         onClose();
//       }, 3000); // Auto-close after 3 seconds
//       return () => clearTimeout(timer);
//     }
//   }, [autoClose, onClose]);

//   if (!message) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
//         <p className="text-gray-800 text-lg mb-4">{message}</p>
//         {!autoClose && (
//           <button
//             onClick={onClose}
//             className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//           >
//             OK
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

export default function ImageCropper() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fileName, setFileName] = useState("image-cadree"); // Filename for the active image
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 }); // Display size of active image
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  }); // Crop area state, represents the DISPLAYED crop area
  // Message state and autoClose state removed as per user request to remove popups.
  // const [message, setMessage] = useState<string | null>(null);
  // const [messageAutoClose, setMessageAutoClose] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null); // Ref for the currently displayed image
  const containerRef = useRef<HTMLDivElement>(null);

  // Get the active image from the state
  const activeImage = images.find((img) => img.id === activeImageId);

  // Update fileName and displayed cropArea when activeImage changes
  useEffect(() => {
    if (activeImage) {
      setFileName(activeImage.name);
      const img = new Image();
      img.src = activeImage.src;
      img.onload = () => {
        const containerWidth = containerRef.current?.offsetWidth || 600;
        const containerHeight = 400;

        const scale = Math.min(
          containerWidth / img.naturalWidth,
          containerHeight / img.naturalHeight
        );
        const displayWidth = img.naturalWidth * scale;
        const displayHeight = img.naturalHeight * scale;
        setImageSize({ width: displayWidth, height: displayHeight });

        // Convert stored original cropArea to displayed cropArea
        setCropArea({
          x:
            (activeImage.cropArea.x / activeImage.originalWidth) * displayWidth,
          y:
            (activeImage.cropArea.y / activeImage.originalHeight) *
            displayHeight,
          width:
            (activeImage.cropArea.width / activeImage.originalWidth) *
            displayWidth,
          height:
            (activeImage.cropArea.height / activeImage.originalHeight) *
            displayHeight,
        });
      };
    } else {
      setFileName("image-cadree");
      setImageSize({ width: 0, height: 0 });
      setCropArea({ x: 0, y: 0, width: 200, height: 200 }); // Reset to default if no active image
    }
  }, [activeImage]);

  // Function to show custom message (removed as per user request)
  // const showMessage = (msg: string, autoClose = false) => {
  //   setMessage(msg);
  //   setMessageAutoClose(autoClose);
  // };

  // Function to close custom message (removed as per user request)
  // const closeMessage = () => {
  //   setMessage(null);
  //   setMessageAutoClose(false);
  // };

  const processFiles = useCallback((files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        // showMessage(`Le fichier "${file.name}" n'est pas une image et a été ignoré.`, true); // Removed popup
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const newImageId = crypto.randomUUID();
          const containerWidth = containerRef.current?.offsetWidth || 600;
          const containerHeight = 400;

          const scale = Math.min(
            containerWidth / img.naturalWidth,
            containerHeight / img.naturalHeight
          );
          const displayWidth = img.naturalWidth * scale;
          const displayHeight = img.naturalHeight * scale;

          const cropSize = Math.min(displayWidth, displayHeight) * 0.6;
          const initialDisplayCropArea = {
            x: (displayWidth - cropSize) / 2,
            y: (displayHeight - cropSize) / 2,
            width: cropSize,
            height: cropSize,
          };

          // Store crop area relative to ORIGINAL image dimensions
          const initialOriginalCropArea = {
            x: (initialDisplayCropArea.x / displayWidth) * img.naturalWidth,
            y: (initialDisplayCropArea.y / displayHeight) * img.naturalHeight,
            width:
              (initialDisplayCropArea.width / displayWidth) * img.naturalWidth,
            height:
              (initialDisplayCropArea.height / displayHeight) *
              img.naturalHeight,
          };

          setImages((prevImages) => {
            const newImages = [
              ...prevImages,
              {
                id: newImageId,
                src: result,
                name:
                  file.name.split(".").slice(0, -1).join(".") || "image-cadree",
                cropArea: initialOriginalCropArea,
                croppedSrc: null,
                originalWidth: img.naturalWidth,
                originalHeight: img.naturalHeight,
              },
            ];
            // Set the newly uploaded image as active if it's the first one or user preference
            if (prevImages.length === 0) {
              // Only set active if no images were present before
              setActiveImageId(newImageId);
            }
            return newImages;
          });
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        processFiles(event.target.files);
        event.target.value = ""; // Clear the input value
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault(); // Prevent default to allow drop
      event.stopPropagation();
      event.dataTransfer.dropEffect = "copy"; // Visual feedback
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault(); // Prevent default browser handling of dropped files
      event.stopPropagation();
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        processFiles(event.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, action: "drag" | "resize") => {
      if (!activeImage) return;
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (action === "drag") {
        setIsDragging(true);
        setDragStart({ x: x - cropArea.x, y: y - cropArea.y }); // Use displayed cropArea
      } else {
        setIsResizing(true);
        setDragStart({ x, y });
      }
    },
    [activeImage, cropArea] // Added cropArea to dependencies
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if ((!isDragging && !isResizing) || !activeImage) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate scale factors from display dimensions to original image dimensions
      const scaleXToOriginal = activeImage.originalWidth / imageSize.width;
      const scaleYToOriginal = activeImage.originalHeight / imageSize.height;

      let newDisplayCropArea: CropArea = { ...cropArea }; // Start with current displayed crop area

      if (isDragging) {
        const newDisplayX = Math.max(
          0,
          Math.min(imageSize.width - cropArea.width, x - dragStart.x)
        );
        const newDisplayY = Math.max(
          0,
          Math.min(imageSize.height - cropArea.height, y - dragStart.y)
        );
        newDisplayCropArea = { ...cropArea, x: newDisplayX, y: newDisplayY };
      } else if (isResizing) {
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;
        const delta = Math.max(deltaX, deltaY); // For square resize

        const newDisplaySize = Math.max(
          50, // Minimum crop size in display pixels
          Math.min(
            imageSize.width - cropArea.x, // Max width limited by image bounds
            imageSize.height - cropArea.y, // Max height limited by image bounds
            cropArea.width + delta // New width based on delta
          )
        );
        newDisplayCropArea = {
          ...cropArea,
          width: newDisplaySize,
          height: newDisplaySize,
        };
      }

      // Update the local cropArea state for immediate visual feedback
      setCropArea(newDisplayCropArea);

      // Convert the new *displayed* crop area to *original* image dimensions
      // and update the activeImage in the 'images' state.
      const updatedOriginalCropArea: CropArea = {
        x: newDisplayCropArea.x * scaleXToOriginal,
        y: newDisplayCropArea.y * scaleYToOriginal,
        width: newDisplayCropArea.width * scaleXToOriginal,
        height: newDisplayCropArea.height * scaleYToOriginal,
      };

      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === activeImageId
            ? { ...img, cropArea: updatedOriginalCropArea }
            : img
        )
      );

      // Only update dragStart for resizing, not dragging
      if (isResizing) {
        setDragStart({ x, y });
      }
    },
    [
      isDragging,
      isResizing,
      dragStart,
      activeImage,
      activeImageId,
      imageSize,
      cropArea,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const clearActiveImage = useCallback(() => {
    if (!activeImageId) return;
    setImages((prevImages) => {
      const remainingImages = prevImages.filter(
        (img) => img.id !== activeImageId
      );
      if (remainingImages.length > 0) {
        setActiveImageId(remainingImages[0].id); // Set first remaining image as active
      } else {
        setActiveImageId(null); // No images left
      }
      return remainingImages;
    });
    // showMessage("Image sélectionnée effacée.", true); // Removed popup
  }, [activeImageId]);

  const clearAllImages = useCallback(() => {
    setImages([]);
    setActiveImageId(null);
    // showMessage("Toutes les images ont été effacées.", true); // Removed popup
  }, []);

  const performCrop = useCallback(() => {
    if (!activeImage || !imageRef.current || !canvasRef.current) {
      // showMessage("Veuillez d'abord télécharger une image.", false); // Removed popup
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    // Calculate scale from displayed image size to original image size
    // Use activeImage's original dimensions for accurate scaling
    const scaleX = img.naturalWidth / imageSize.width;
    const scaleY = img.naturalHeight / imageSize.height;

    // Use current cropArea (which is scaled to display size) to calculate original pixel crop
    const originalCropX = cropArea.x * scaleX;
    const originalCropY = cropArea.y * scaleY;
    const originalCropWidth = cropArea.width * scaleX;
    const originalCropHeight = cropArea.height * scaleY;

    // Set canvas size to the original pixel size of the cropped area
    canvas.width = originalCropWidth;
    canvas.height = originalCropHeight;

    // Draw the cropped portion from the original image dimensions
    ctx.drawImage(
      img,
      originalCropX,
      originalCropY,
      originalCropWidth,
      originalCropHeight,
      0,
      0,
      originalCropWidth,
      originalCropHeight
    );

    const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);

    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === activeImageId
          ? { ...img, croppedSrc: croppedDataUrl, name: fileName } // Update name here
          : img
      )
    );
    // Removed the explicit showMessage for successful crop
    // showMessage("Image cadrée avec succès !", true);
  }, [activeImage, activeImageId, imageSize, cropArea, fileName]);

  const downloadImageFile = useCallback(async (imageToDownload: ImageItem) => {
    if (!imageToDownload.croppedSrc) {
      // showMessage(`L'image "${imageToDownload.name}" n'a pas encore été cadrée.`, false); // Removed popup
      return;
    }

    const blob = await (await fetch(imageToDownload.croppedSrc)).blob();

    try {
      if ("showSaveFilePicker" in window) {
        // Case for single download with file picker
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `${imageToDownload.name}.jpeg`,
          types: [
            {
              description: "JPEG Image",
              accept: { "image/jpeg": [".jpeg", ".jpg"] },
            },
          ],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        // showMessage(`L'image "${imageToDownload.name}" a été sauvegardée dans le dossier choisi.`, true); // Removed popup
      } else {
        // Fallback to traditional download
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${imageToDownload.name}.jpeg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // showMessage(`L'image "${imageToDownload.name}" a été téléchargée dans le dossier par défaut.`, true); // Removed popup
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        // showMessage("Opération annulée par l'utilisateur.", false); // Removed popup
      } else {
        console.error("Erreur lors du téléchargement de l'image:", error);
        // Fallback to traditional download if showSaveFilePicker fails for other reasons
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${imageToDownload.name}.jpeg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // showMessage(`Erreur lors de la sauvegarde de "${imageToDownload.name}". Téléchargement direct initié dans le dossier par défaut.`, false); // Removed popup
      }
    }
  }, []);

  const downloadAllCroppedImages = useCallback(async () => {
    const croppedImages = images.filter((img) => img.croppedSrc);
    if (croppedImages.length === 0) {
      // showMessage("Aucune image n'a été cadrée pour le téléchargement.", false); // Removed popup
      return;
    }

    // Attempt to use showDirectoryPicker for batch download
    if ("showDirectoryPicker" in window) {
      try {
        const dirHandle = await (window as any).showDirectoryPicker({
          mode: "readwrite",
        });
        for (const img of croppedImages) {
          await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
          const blob = await (await fetch(img.croppedSrc!)).blob();
          const fileHandle = await dirHandle.getFileHandle(`${img.name}.jpeg`, {
            create: true,
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        }
        // showMessage("Toutes les images cadrées ont été téléchargées dans le dossier choisi.", true); // Removed popup
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          // showMessage("Sélection de répertoire annulée. Le téléchargement de toutes les images n'a pas été effectué.", false); // Removed popup
        } else {
          console.error("Erreur lors de la sélection du répertoire:", error);
          // Fallback to individual downloads if directory picker fails
          for (const img of croppedImages) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            const url = URL.createObjectURL(
              await (await fetch(img.croppedSrc!)).blob()
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = `${img.name}.jpeg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
          // showMessage("Erreur lors de la sélection du répertoire. Les images ont été téléchargées individuellement dans le dossier par défaut du navigateur.", false); // Removed popup
        }
      }
    } else {
      // Fallback for browsers not supporting showDirectoryPicker
      for (const img of croppedImages) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const url = URL.createObjectURL(
          await (await fetch(img.croppedSrc!)).blob()
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = `${img.name}.jpeg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      // showMessage("Votre navigateur ne supporte pas la sélection de répertoire. Les images ont été téléchargées individuellement dans le dossier par défaut du navigateur.", false); // Removed popup
    }
  }, [images]);

  const resetCrop = useCallback(() => {
    if (activeImage) {
      const img = new Image();
      img.src = activeImage.src;
      img.onload = () => {
        const containerWidth = containerRef.current?.offsetWidth || 600;
        const containerHeight = 400;

        const scale = Math.min(
          containerWidth / img.naturalWidth,
          containerHeight / img.naturalHeight
        );
        const displayWidth = img.naturalWidth * scale;
        const displayHeight = img.naturalHeight * scale;

        const cropSize = Math.min(displayWidth, displayHeight) * 0.6;
        const newDisplayCropArea = {
          x: (displayWidth - cropSize) / 2,
          y: (displayHeight - cropSize) / 2,
          width: cropSize,
          height: cropSize,
        };

        setImages((prevImages) =>
          prevImages.map((imgItem) =>
            imgItem.id === activeImageId
              ? {
                  ...imgItem,
                  cropArea: {
                    // Store crop area relative to original image dimensions
                    x: (newDisplayCropArea.x / displayWidth) * img.naturalWidth,
                    y:
                      (newDisplayCropArea.y / displayHeight) *
                      img.naturalHeight,
                    width:
                      (newDisplayCropArea.width / displayWidth) *
                      img.naturalWidth,
                    height:
                      (newDisplayCropArea.height / displayHeight) *
                      img.naturalHeight,
                  },
                  croppedSrc: null,
                }
              : imgItem
          )
        );
        // Update the displayed cropArea as well
        setCropArea(newDisplayCropArea);
        // showMessage("Zone de cadrage réinitialisée.", true); // Removed popup
      };
    }
  }, [activeImage, activeImageId]);

  // Update image container size on window resize
  useEffect(() => {
    const handleResize = () => {
      if (activeImage && imageRef.current) {
        const img = imageRef.current;
        const containerWidth = containerRef.current?.offsetWidth || 600;
        const containerHeight = 400;

        const scale = Math.min(
          containerWidth / img.naturalWidth,
          containerHeight / img.naturalHeight
        );
        const displayWidth = img.naturalWidth * scale;
        const displayHeight = img.naturalHeight * scale;

        setImageSize({ width: displayWidth, height: displayHeight });

        // Recalculate displayed crop area position and size based on the stored original cropArea
        setCropArea((prev) => {
          return {
            x:
              (activeImage.cropArea.x / activeImage.originalWidth) *
              displayWidth,
            y:
              (activeImage.cropArea.y / activeImage.originalHeight) *
              displayHeight,
            width:
              (activeImage.cropArea.width / activeImage.originalWidth) *
              displayWidth,
            height:
              (activeImage.cropArea.height / activeImage.originalHeight) *
              displayHeight,
          };
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeImage, imageSize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8 font-inter text-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-2">
            Cadreur d&apos;Images
          </h1>
          <p className="text-gray-600 text-lg">
            Uploadez, cadrez et téléchargez vos images.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 mb-6 border border-blue-100">
          {!activeImage ? (
            <div
              className="border-2 border-dashed border-blue-300 rounded-lg p-8 sm:p-12 text-center hover:border-blue-500 transition-all duration-300 ease-in-out bg-blue-50"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <MdUpload className="mx-auto mb-4 text-blue-500" size={64} />
              <p className="text-gray-600 text-lg mb-4">
                Glissez-déposez une image ou cliquez pour sélectionner
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="imageInput"
                multiple // Allow multiple file selection
              />
              <label
                htmlFor="imageInput"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
              >
                <MdUpload className="mr-2" size={20} />
                Choisir une image(s)
              </label>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Image with crop overlay */}
              <div
                ref={containerRef}
                className="relative mx-auto bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                style={{
                  width: imageSize.width || "100%",
                  height: imageSize.height || "400px",
                  maxWidth: "100%",
                  maxHeight: "400px",
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={activeImage.src}
                  alt="Image à cadrer"
                  className="w-full h-full object-contain"
                  draggable={false}
                />

                {/* Crop overlay */}
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move rounded-md"
                  style={{
                    left: cropArea.x,
                    top: cropArea.y,
                    width: cropArea.width,
                    height: cropArea.height,
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "drag")}
                >
                  {/* Resize handle */}
                  <div
                    className="absolute -bottom-2 -right-2 w-5 h-5 bg-blue-600 border-2 border-white rounded-full cursor-se-resize shadow-md"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "resize");
                    }}
                  />

                  {/* Corner indicators (optional, for visual flair) */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-600 rounded-full" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-600 rounded-full" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Nom du fichier"
                  className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-700"
                />

                <button
                  onClick={resetCrop}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-md transform hover:scale-105"
                  title="Réinitialiser la zone de cadrage"
                >
                  <MdRefresh size={18} />
                  Réinitialiser
                </button>

                <button
                  onClick={performCrop}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out shadow-md transform hover:scale-105"
                  title="Cadrer l'image et voir l'aperçu"
                >
                  <MdCrop size={18} />
                  Cadrer l&apos;image
                </button>

                <button
                  onClick={() => downloadImageFile(activeImage)}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Télécharger l'image cadrée"
                  disabled={!activeImage?.croppedSrc}
                >
                  <MdDownload size={18} />
                  Télécharger JPEG
                </button>

                <label
                  htmlFor="imageInput"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer shadow-md transform hover:scale-105"
                  title="Télécharger une nouvelle image"
                >
                  <MdUpload size={18} />
                  Ajouter image(s)
                </label>

                <button
                  onClick={clearActiveImage}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out shadow-md transform hover:scale-105"
                  title="Effacer l'image sélectionnée"
                >
                  <MdClose size={18} />
                  Effacer image
                </button>
              </div>

              {/* Preview and Info */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-start">
                {activeImage?.croppedSrc && (
                  <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner text-center">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                      Aperçu de l&apos;image cadrée
                    </h3>
                    <img
                      src={activeImage.croppedSrc}
                      alt="Image cadrée"
                      className="max-w-full h-auto mx-auto rounded-md border border-gray-300 shadow-md"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                    <button
                      onClick={() => downloadImageFile(activeImage)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all duration-300 ease-in-out shadow-md transform hover:scale-105"
                      title="Télécharger cette image cadrée"
                    >
                      <MdDownload size={18} />
                      Télécharger
                    </button>
                  </div>
                )}
                <div className="flex-1 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner text-sm text-gray-600 text-center sm:text-left">
                  <h3 className="text-lg font-semibold mb-2 text-gray-700">
                    Informations sur le cadrage
                  </h3>
                  <p>
                    Taille du cadrage: {Math.round(cropArea.width)} ×{" "}
                    {Math.round(cropArea.height)} pixels
                  </p>
                  <p>
                    Position: ({Math.round(cropArea.x)},{" "}
                    {Math.round(cropArea.y)})
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 mb-6 border border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4 text-center">
              Vos images
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {images.map((imgItem) => (
                <div
                  key={imgItem.id}
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ease-in-out ${
                    imgItem.id === activeImageId
                      ? "border-blue-600 shadow-lg scale-105"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  onClick={() => setActiveImageId(imgItem.id)}
                  style={{ width: "100px", height: "100px" }}
                >
                  <img
                    src={imgItem.src}
                    alt={imgItem.name}
                    className="w-full h-full object-cover"
                  />
                  {imgItem.croppedSrc && (
                    <>
                      <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded-full">
                        Cadrée
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent activating the image when clicking download
                          downloadImageFile(imgItem);
                        }}
                        className="absolute bottom-1 right-1 bg-green-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title={`Télécharger ${imgItem.name}-cadrée.jpeg`}
                      >
                        <MdDownload size={14} />
                      </button>
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                    {imgItem.name}
                  </div>
                </div>
              ))}
            </div>
            {images.length > 0 && (
              <div className="text-center mt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={downloadAllCroppedImages}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={images.filter((img) => img.croppedSrc).length === 0}
                >
                  <MdDownload size={20} />
                  Télécharger toutes les images cadrées
                </button>
                <button
                  onClick={clearAllImages}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all duration-300 ease-in-out shadow-lg transform hover:scale-105"
                >
                  <MdDeleteForever size={20} />
                  Effacer toutes les images
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Usage instructions */}
        <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-8 border border-blue-100">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4">
            Comment utiliser
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-base text-gray-700">
            <div className="text-center bg-blue-50 p-4 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                1
              </div>
              <p>Uploadez votre image(s) en cliquant ou glissant-déposant.</p>
            </div>
            <div className="text-center bg-blue-50 p-4 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                2
              </div>
              <p>Sélectionnez une image dans la galerie pour la modifier.</p>
            </div>
            <div className="text-center bg-blue-50 p-4 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                3
              </div>
              <p>
                Ajustez le cadre de cadrage en le déplaçant et le
                redimensionnant.
              </p>
            </div>
            <div className="text-center bg-blue-50 p-4 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                4
              </div>
              <p>Cliquez sur Cadrer l&apos;image pour générer l&apos;aperçu.</p>
            </div>
            <div className="text-center bg-blue-50 p-4 rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                5
              </div>
              <p>
                Nommez, téléchargez, le fichier sera automatiquement enregistré.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* MessageModal component removed from JSX */}
      {/* <MessageModal
        message={message}
        onClose={closeMessage}
        autoClose={messageAutoClose}
      /> */}
    </div>
  );
}
