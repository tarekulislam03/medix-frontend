import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    CameraIcon,
    PhotoIcon,
    XMarkIcon,
    ArrowPathIcon,
    CheckIcon,
    AdjustmentsHorizontalIcon,
    SparklesIcon,
    DocumentIcon,
} from '@heroicons/react/24/outline';

interface Point {
    x: number;
    y: number;
}

interface DocumentScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (file: File) => void;
    /** Start mode: 'camera' to open camera, 'gallery' to immediately open file picker */
    startMode?: 'camera' | 'gallery';
}

/**
 * Document Scanner Component - Google Drive Style
 * Features: Camera capture, corner detection, perspective correction, image enhancement
 */
const DocumentScanner: React.FC<DocumentScannerProps> = ({ isOpen, onClose, onCapture, startMode = 'camera' }) => {
    const [mode, setMode] = useState<'camera' | 'crop' | 'preview'>('camera');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    // Corner points for perspective correction (normalized 0-1)
    const [corners, setCorners] = useState<Point[]>([
        { x: 0.1, y: 0.1 },   // Top-left
        { x: 0.9, y: 0.1 },   // Top-right
        { x: 0.9, y: 0.9 },   // Bottom-right
        { x: 0.1, y: 0.9 },   // Bottom-left
    ]);
    const [activeCorner, setActiveCorner] = useState<number | null>(null);

    // Enhancement settings
    const [enhanceMode, setEnhanceMode] = useState<'auto' | 'color' | 'grayscale' | 'bw'>('auto');


    // Image dimensions (for future use with aspect ratio preservation)
    const [_imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cropCanvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cropContainerRef = useRef<HTMLDivElement>(null);

    // Initialize camera
    const initCamera = useCallback(async () => {
        console.log('[Scanner] Initializing camera...');
        setCameraReady(false);
        setCameraError(null);

        if (!navigator.mediaDevices?.getUserMedia) {
            setCameraError('Camera not supported. Please use Chrome or Safari.');
            return;
        }

        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().then(() => setCameraReady(true)).catch(() => {
                        setCameraError('Failed to start camera preview');
                    });
                };
                videoRef.current.play().catch(() => { });
            }
        } catch (err: any) {
            console.error('[Scanner] Camera error:', err);
            if (err.name === 'NotAllowedError') {
                setCameraError('Camera access denied. Please allow camera permission.');
            } else if (err.name === 'NotFoundError') {
                setCameraError('No camera found on this device.');
            } else {
                setCameraError('Failed to access camera.');
            }
        }
    }, []);

    // Cleanup camera
    const cleanupCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setCameraReady(false);
    }, []);

    // Initialize when opened - handle startMode
    useEffect(() => {
        if (isOpen) {
            if (startMode === 'gallery') {
                // Open gallery immediately
                setTimeout(() => {
                    galleryInputRef.current?.click();
                }, 150);
            } else if (mode === 'camera') {
                const timer = setTimeout(initCamera, 100);
                return () => { clearTimeout(timer); cleanupCamera(); };
            }
        }
        if (!isOpen) {
            cleanupCamera();
        }
    }, [isOpen, mode, startMode, initCamera, cleanupCamera]);

    // Capture photo and go to crop mode
    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.95);

        setImageDimensions({ width: video.videoWidth, height: video.videoHeight });
        setCapturedImage(imageDataUrl);

        // Reset corners to default document position
        setCorners([
            { x: 0.08, y: 0.08 },
            { x: 0.92, y: 0.08 },
            { x: 0.92, y: 0.92 },
            { x: 0.08, y: 0.92 },
        ]);

        cleanupCamera();
        setMode('crop');
    };

    // Handle gallery selection
    const handleGallerySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;

            // Get image dimensions
            const img = new Image();
            img.onload = () => {
                setImageDimensions({ width: img.width, height: img.height });
                setCapturedImage(result);
                setCorners([
                    { x: 0.08, y: 0.08 },
                    { x: 0.92, y: 0.08 },
                    { x: 0.92, y: 0.92 },
                    { x: 0.08, y: 0.92 },
                ]);
                cleanupCamera();
                setMode('crop');
            };
            img.src = result;
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    };

    // Handle corner drag
    const handleCornerMove = (index: number, clientX: number, clientY: number) => {
        if (!cropContainerRef.current) return;

        const rect = cropContainerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        setCorners(prev => {
            const newCorners = [...prev];
            newCorners[index] = { x, y };
            return newCorners;
        });
    };

    const handleTouchMove = (e: React.TouchEvent, index: number) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleCornerMove(index, touch.clientX, touch.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (activeCorner !== null) {
            handleCornerMove(activeCorner, e.clientX, e.clientY);
        }
    };

    // Apply perspective transformation and enhancement
    const processImage = async () => {
        if (!capturedImage || !cropCanvasRef.current) return;

        setProcessing(true);

        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
                img.src = capturedImage;
            });

            const canvas = cropCanvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Calculate the bounding box of the selected area
            const srcPoints = corners.map(c => ({
                x: c.x * img.width,
                y: c.y * img.height
            }));

            // Calculate output dimensions based on the quadrilateral
            const width1 = Math.hypot(srcPoints[1].x - srcPoints[0].x, srcPoints[1].y - srcPoints[0].y);
            const width2 = Math.hypot(srcPoints[2].x - srcPoints[3].x, srcPoints[2].y - srcPoints[3].y);
            const height1 = Math.hypot(srcPoints[3].x - srcPoints[0].x, srcPoints[3].y - srcPoints[0].y);
            const height2 = Math.hypot(srcPoints[2].x - srcPoints[1].x, srcPoints[2].y - srcPoints[1].y);

            const outputWidth = Math.round(Math.max(width1, width2));
            const outputHeight = Math.round(Math.max(height1, height2));

            canvas.width = outputWidth;
            canvas.height = outputHeight;

            // Apply perspective transform using bilinear interpolation
            const srcImageData = (() => {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                const tempCtx = tempCanvas.getContext('2d')!;
                tempCtx.drawImage(img, 0, 0);
                return tempCtx.getImageData(0, 0, img.width, img.height);
            })();

            const dstImageData = ctx.createImageData(outputWidth, outputHeight);

            // Simple perspective-like transformation
            for (let dy = 0; dy < outputHeight; dy++) {
                for (let dx = 0; dx < outputWidth; dx++) {
                    const tx = dx / outputWidth;
                    const ty = dy / outputHeight;

                    // Bilinear interpolation of source coordinates
                    const topX = srcPoints[0].x + (srcPoints[1].x - srcPoints[0].x) * tx;
                    const topY = srcPoints[0].y + (srcPoints[1].y - srcPoints[0].y) * tx;
                    const bottomX = srcPoints[3].x + (srcPoints[2].x - srcPoints[3].x) * tx;
                    const bottomY = srcPoints[3].y + (srcPoints[2].y - srcPoints[3].y) * tx;

                    const sx = topX + (bottomX - topX) * ty;
                    const sy = topY + (bottomY - topY) * ty;

                    // Get source pixel
                    const srcX = Math.floor(sx);
                    const srcY = Math.floor(sy);

                    if (srcX >= 0 && srcX < img.width && srcY >= 0 && srcY < img.height) {
                        const srcIdx = (srcY * img.width + srcX) * 4;
                        const dstIdx = (dy * outputWidth + dx) * 4;

                        dstImageData.data[dstIdx] = srcImageData.data[srcIdx];
                        dstImageData.data[dstIdx + 1] = srcImageData.data[srcIdx + 1];
                        dstImageData.data[dstIdx + 2] = srcImageData.data[srcIdx + 2];
                        dstImageData.data[dstIdx + 3] = 255;
                    }
                }
            }

            ctx.putImageData(dstImageData, 0, 0);

            // Apply enhancement based on mode
            if (enhanceMode !== 'color') {
                const enhancedData = ctx.getImageData(0, 0, outputWidth, outputHeight);

                for (let i = 0; i < enhancedData.data.length; i += 4) {
                    const r = enhancedData.data[i];
                    const g = enhancedData.data[i + 1];
                    const b = enhancedData.data[i + 2];

                    if (enhanceMode === 'grayscale' || enhanceMode === 'auto') {
                        // Convert to grayscale
                        const gray = 0.299 * r + 0.587 * g + 0.114 * b;

                        if (enhanceMode === 'auto') {
                            // Auto enhance: increase contrast and brightness for documents
                            const enhanced = Math.min(255, Math.max(0, (gray - 128) * 1.3 + 140));
                            enhancedData.data[i] = enhanced;
                            enhancedData.data[i + 1] = enhanced;
                            enhancedData.data[i + 2] = enhanced;
                        } else {
                            enhancedData.data[i] = gray;
                            enhancedData.data[i + 1] = gray;
                            enhancedData.data[i + 2] = gray;
                        }
                    } else if (enhanceMode === 'bw') {
                        // Black and white threshold
                        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                        const bw = gray > 140 ? 255 : 0;
                        enhancedData.data[i] = bw;
                        enhancedData.data[i + 1] = bw;
                        enhancedData.data[i + 2] = bw;
                    }
                }

                ctx.putImageData(enhancedData, 0, 0);
            }

            const processedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            setProcessedImage(processedDataUrl);
            setMode('preview');
        } catch (error) {
            console.error('[Scanner] Processing error:', error);
        } finally {
            setProcessing(false);
        }
    };

    // Confirm and return the processed image
    const confirmCapture = () => {
        if (!processedImage) return;

        const canvas = cropCanvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], `scan_${Date.now()}.jpg`, { type: 'image/jpeg' });
                onCapture(file);
                handleClose();
            }
        }, 'image/jpeg', 0.90);
    };

    // Go back to crop mode
    const backToCrop = () => {
        setProcessedImage(null);
        setMode('crop');
    };

    // Retake photo
    const retakePhoto = () => {
        setCapturedImage(null);
        setProcessedImage(null);
        setMode('camera');
    };

    // Close and reset
    const handleClose = () => {
        cleanupCamera();
        setCapturedImage(null);
        setProcessedImage(null);
        setMode('camera');
        setEnhanceMode('auto');
        setCameraError(null);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
            {/* Hidden canvases */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <canvas ref={cropCanvasRef} style={{ display: 'none' }} />

            {/* Hidden file input */}
            <input
                type="file"
                ref={galleryInputRef}
                onChange={handleGallerySelect}
                accept="image/*"
                style={{ position: 'absolute', left: '-9999px' }}
            />

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-black">
                <button type="button" onClick={handleClose} className="p-2 text-white">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-white font-semibold">
                    {mode === 'camera' && 'Scan Document'}
                    {mode === 'crop' && 'Adjust Corners'}
                    {mode === 'preview' && 'Preview'}
                </h2>
                <div className="w-10" />
            </div>

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden">
                {/* Camera Mode */}
                {mode === 'camera' && (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                        />

                        {!cameraReady && !cameraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3" />
                                <p className="text-white text-sm">Starting camera...</p>
                            </div>
                        )}

                        {cameraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-6">
                                <CameraIcon className="h-14 w-14 text-gray-500 mb-3" />
                                <p className="text-white text-center text-sm mb-4">{cameraError}</p>
                                <button
                                    type="button"
                                    onClick={() => galleryInputRef.current?.click()}
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    <PhotoIcon className="h-5 w-5" />
                                    Upload from Gallery
                                </button>
                            </div>
                        )}

                        {cameraReady && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-8 border-2 border-white/50 rounded-lg">
                                    <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl" />
                                    <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr" />
                                    <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl" />
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br" />
                                </div>
                                <div className="absolute top-3 left-0 right-0 text-center">
                                    <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                                        Position document in frame
                                    </span>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Crop Mode - Perspective Adjustment */}
                {mode === 'crop' && capturedImage && (
                    <div
                        ref={cropContainerRef}
                        className="absolute inset-0 touch-none"
                        onMouseMove={handleMouseMove}
                        onMouseUp={() => setActiveCorner(null)}
                        onMouseLeave={() => setActiveCorner(null)}
                    >
                        <img
                            src={capturedImage}
                            alt="Captured"
                            className="w-full h-full object-contain"
                        />

                        {/* Overlay with hole for selected area */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            {/* Draw the selection polygon */}
                            <polygon
                                points={corners.map(c => `${c.x * 100}%,${c.y * 100}%`).join(' ')}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="3"
                            />

                            {/* Lines connecting corners */}
                            {corners.map((corner, i) => {
                                const next = corners[(i + 1) % 4];
                                return (
                                    <line
                                        key={i}
                                        x1={`${corner.x * 100}%`}
                                        y1={`${corner.y * 100}%`}
                                        x2={`${next.x * 100}%`}
                                        y2={`${next.y * 100}%`}
                                        stroke="#3B82F6"
                                        strokeWidth="2"
                                    />
                                );
                            })}
                        </svg>

                        {/* Corner handles */}
                        {corners.map((corner, index) => (
                            <div
                                key={index}
                                className="absolute w-10 h-10 -ml-5 -mt-5 flex items-center justify-center cursor-move touch-none"
                                style={{
                                    left: `${corner.x * 100}%`,
                                    top: `${corner.y * 100}%`,
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setActiveCorner(index);
                                }}
                                onTouchStart={(e) => {
                                    e.preventDefault();
                                    setActiveCorner(index);
                                }}
                                onTouchMove={(e) => handleTouchMove(e, index)}
                                onTouchEnd={() => setActiveCorner(null)}
                            >
                                <div className="w-6 h-6 bg-blue-500 border-3 border-white rounded-full shadow-lg" />
                            </div>
                        ))}

                        {/* Instructions */}
                        <div className="absolute top-4 left-0 right-0 text-center">
                            <span className="bg-black/70 text-white text-xs px-4 py-2 rounded-full">
                                Drag corners to fit document edges
                            </span>
                        </div>
                    </div>
                )}

                {/* Preview Mode */}
                {mode === 'preview' && processedImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 p-4">
                        <img
                            src={processedImage}
                            alt="Processed"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                        />
                    </div>
                )}

                {/* Processing Overlay */}
                {processing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-white font-medium">Processing document...</p>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="flex-shrink-0 bg-black px-4 py-4 pb-8">
                {mode === 'camera' && (
                    <div className="flex items-center justify-between max-w-sm mx-auto">
                        <button
                            type="button"
                            onClick={() => galleryInputRef.current?.click()}
                            className="w-12 h-12 bg-white/20 text-white rounded-full flex items-center justify-center"
                        >
                            <PhotoIcon className="h-6 w-6" />
                        </button>

                        <button
                            type="button"
                            onClick={capturePhoto}
                            disabled={!cameraReady}
                            className="w-18 h-18 rounded-full bg-white p-1 disabled:opacity-40"
                        >
                            <div className="w-full h-full rounded-full border-4 border-gray-300 bg-white flex items-center justify-center" style={{ width: 64, height: 64 }}>
                                <DocumentIcon className="h-7 w-7 text-gray-700" />
                            </div>
                        </button>

                        <div className="w-12 h-12" />
                    </div>
                )}

                {mode === 'crop' && (
                    <div className="space-y-4">
                        {/* Enhancement Mode Selector */}
                        <div className="flex justify-center gap-2">
                            {[
                                { id: 'auto', label: 'Auto', icon: SparklesIcon },
                                { id: 'color', label: 'Color', icon: PhotoIcon },
                                { id: 'grayscale', label: 'Gray', icon: DocumentIcon },
                                { id: 'bw', label: 'B&W', icon: AdjustmentsHorizontalIcon },
                            ].map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setEnhanceMode(id as typeof enhanceMode)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 ${enhanceMode === id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/15 text-white/70'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 max-w-md mx-auto">
                            <button
                                type="button"
                                onClick={retakePhoto}
                                className="flex-1 py-3 bg-white/15 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                            >
                                <ArrowPathIcon className="h-5 w-5" />
                                Retake
                            </button>

                            <button
                                type="button"
                                onClick={processImage}
                                disabled={processing}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <CheckIcon className="h-5 w-5" />
                                Crop & Enhance
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'preview' && (
                    <div className="flex items-center gap-3 max-w-md mx-auto">
                        <button
                            type="button"
                            onClick={backToCrop}
                            className="flex-1 py-3 bg-white/15 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                        >
                            <ArrowPathIcon className="h-5 w-5" />
                            Adjust
                        </button>

                        <button
                            type="button"
                            onClick={confirmCapture}
                            className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium flex items-center justify-center gap-2"
                        >
                            <CheckIcon className="h-5 w-5" />
                            Use Scan
                        </button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default DocumentScanner;
