// Screenshot Cameras Module
(function () {
    "use strict";

    // Wait for cloudstream to be available
    function initScreenshotFeature() {
        // Check if cloudstream is available
        if (typeof window.cloudstream === "undefined") {
            console.warn("Cloudstream not available yet, retrying...");
            setTimeout(initScreenshotFeature, 500);
            return;
        }

        // Get all cameras
        const cameras = document.querySelectorAll(".camera[data-camera]");
        const cameraNames = Array.from(cameras).map((cam) => cam.dataset.camera);
        const streamContainer = document.getElementById("streamContainer");

        if (!streamContainer || cameraNames.length === 0) {
            console.warn("Stream container or cameras not found");
            return;
        }

        // Function to resize image to max width while maintaining aspect ratio
        function resizeImage(blob, maxWidth = 1280, quality = 0.85) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    // Calculate new dimensions
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    // Create canvas with new dimensions
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");

                    // Draw resized image
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to JPEG with specified quality
                    canvas.toBlob(
                        (resizedBlob) => {
                            if (resizedBlob) {
                                const url = URL.createObjectURL(resizedBlob);
                                resolve({ url, blob: resizedBlob });
                            } else {
                                reject(new Error("Failed to resize image"));
                            }
                        },
                        "image/jpeg", // Use JPEG format
                        quality // Quality 0.85
                    );
                };
                img.onerror = reject;
                img.src = URL.createObjectURL(blob);
            });
        }

        // Function to take screenshot of streamContainer
        function takeScreenshot(cameraName) {
            return new Promise((resolve, reject) => {
                try {
                    // Try to find canvas element inside streamContainer
                    const canvas = streamContainer.querySelector("canvas");
                    const video = streamContainer.querySelector("video");

                    if (canvas) {
                        // If canvas exists, convert it to image
                        canvas.toBlob(
                            async (blob) => {
                                if (blob) {
                                    try {
                                        // Resize to 1280px max width with quality 0.85
                                        const resized = await resizeImage(blob, 1280, 0.85);
                                        resolve({ url: resized.url, cameraName, blob: resized.blob });
                                    } catch (e) {
                                        // Fallback to original if resize fails
                                        console.warn("Failed to resize screenshot, using original:", e);
                                        const url = URL.createObjectURL(blob);
                                        resolve({ url, cameraName, blob });
                                    }
                                } else {
                                    reject(new Error("Failed to create blob from canvas"));
                                }
                            },
                            "image/png",
                            1.0
                        );
                    } else if (video) {
                        // If video exists, draw it to canvas
                        const tempCanvas = document.createElement("canvas");

                        // Limit resolution to maxWidth (1280px)
                        const maxWidth = 1280;
                        let width = video.videoWidth || video.clientWidth;
                        let height = video.videoHeight || video.clientHeight;

                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }

                        tempCanvas.width = width;
                        tempCanvas.height = height;
                        const ctx = tempCanvas.getContext("2d");
                        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

                        tempCanvas.toBlob(
                            async (blob) => {
                                if (blob) {
                                    // Already resized, convert to JPEG with quality 0.85
                                    try {
                                        const resized = await resizeImage(blob, maxWidth, 0.85);
                                        resolve({ url: resized.url, cameraName, blob: resized.blob });
                                    } catch (e) {
                                        // Fallback to original if resize fails
                                        console.warn("Failed to resize screenshot, using original:", e);
                                        const url = URL.createObjectURL(blob);
                                        resolve({ url, cameraName, blob });
                                    }
                                } else {
                                    reject(new Error("Failed to create blob from video"));
                                }
                            },
                            "image/jpeg", // Use JPEG format
                            0.85 // Quality 0.85
                        );
                    } else {
                        // Fallback: use html2canvas if available, or try to capture the container
                        if (typeof html2canvas !== "undefined") {
                            html2canvas(streamContainer, {
                                backgroundColor: null,
                                useCORS: true,
                                logging: false,
                                scale: 1.0, // Keep original scale
                            }).then(async (canvas) => {
                                canvas.toBlob(
                                    async (blob) => {
                                        if (blob) {
                                            try {
                                                // Resize to 1280px max width with quality 0.85
                                                const resized = await resizeImage(blob, 1280, 0.85);
                                                resolve({ url: resized.url, cameraName, blob: resized.blob });
                                            } catch (e) {
                                                // Fallback to original if resize fails
                                                console.warn("Failed to resize screenshot, using original:", e);
                                                const url = URL.createObjectURL(blob);
                                                resolve({ url, cameraName, blob });
                                            }
                                        } else {
                                            reject(new Error("Failed to create blob"));
                                        }
                                    },
                                    "image/png",
                                    1.0
                                );
                            });
                        } else {
                            reject(new Error("No canvas, video, or html2canvas found"));
                        }
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }

        // Function to switch to a camera
        function switchToCamera(cameraName) {
            return new Promise((resolve) => {
                const camera = document.querySelector(`.camera[data-camera="${cameraName}"]`);
                if (!camera) {
                    console.warn(`Camera ${cameraName} not found`);
                    resolve();
                    return;
                }

                // Remove active class from all cameras
                document.querySelectorAll(".camera").forEach((c) => c.classList.remove("active"));
                camera.classList.add("active");

                // Send camera switch command
                const data = {
                    Type: 0,
                    Key: "test",
                    Value: cameraName,
                };

                window.cloudstream.sendJsonData(data);

                // Wait 1.5 seconds after switching camera before taking screenshot
                setTimeout(() => {
                    resolve();
                }, 2000);
            });
        }

        // Function to capture all cameras
        async function captureAllCameras(download = true) {
            const screenshots = [];
            const originalCamera = document.querySelector(".camera.active")?.dataset.camera;

            console.log("Starting screenshot capture for all cameras...");

            // Filter out FPC camera (do not capture FPC screenshots)
            const camerasToCapture = cameraNames.filter((name) => {
                const upperName = name.toUpperCase();
                return upperName !== "FPC" && upperName !== "FPS";
            });

            console.log(`Filtered cameras: ${camerasToCapture.length} (excluding FPC)`);

            for (let i = 0; i < camerasToCapture.length; i++) {
                const cameraName = camerasToCapture[i];
                console.log(`Capturing ${cameraName} (${i + 1}/${camerasToCapture.length})...`);

                try {
                    // Switch to camera
                    await switchToCamera(cameraName);

                    // Take screenshot
                    const screenshot = await takeScreenshot(cameraName);
                    screenshots.push(screenshot);

                    console.log(`✓ Screenshot captured for ${cameraName}`);
                } catch (error) {
                    console.error(`✗ Failed to capture ${cameraName}:`, error);
                }
            }

            // Restore original camera if it existed
            if (originalCamera) {
                await switchToCamera(originalCamera);
            }

            // Download all screenshots only if download flag is true
            if (download) {
                screenshots.forEach((screenshot, index) => {
                    const link = document.createElement("a");
                    link.href = screenshot.url;
                    link.download = `screenshot_${screenshot.cameraName}_${Date.now()}_${index + 1}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Clean up URL after a delay
                    setTimeout(() => {
                        URL.revokeObjectURL(screenshot.url);
                    }, 100);
                });
            }

            console.log(`✓ All screenshots captured (${screenshots.length}/${cameraNames.length})`);
            return screenshots;
        }

        // Export function to window for use in other modules
        window.captureAllCameras = captureAllCameras;

        // Create screenshot button
        function createScreenshotButton() {
            // Check if button already exists
            if (document.getElementById("screenshotAllBtn")) {
                return;
            }

            const button = document.createElement("button");
            button.id = "screenshotAllBtn";
            button.textContent = "Screenshot All Cameras";
            button.style.cssText = `
                display:none;
                position: absolute;
                bottom: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 6px;
                padding: 10px 16px;
                cursor: pointer;
                z-index: 10;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s ease;
            `;

            button.addEventListener("mouseenter", () => {
                button.style.background = "rgba(0, 0, 0, 0.9)";
            });

            button.addEventListener("mouseleave", () => {
                button.style.background = "rgba(0, 0, 0, 0.7)";
            });

            button.addEventListener("click", async () => {
                button.disabled = true;
                button.textContent = "Capturing...";

                try {
                    await captureAllCameras();
                    button.textContent = "✓ Done!";
                    setTimeout(() => {
                        button.textContent = "Screenshot All Cameras";
                        button.disabled = false;
                    }, 2000);
                } catch (error) {
                    console.error("Error capturing screenshots:", error);
                    button.textContent = "Error - Try Again";
                    setTimeout(() => {
                        button.textContent = "Screenshot All Cameras";
                        button.disabled = false;
                    }, 2000);
                }
            });

            streamContainer.appendChild(button);
        }

        // Create button when stream is ready
        if (window.cloudstream) {
            createScreenshotButton();
        } else {
            // Wait for streamReady event
            window.cloudstream.addEventListener("streamReady", () => {
                createScreenshotButton();
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initScreenshotFeature);
    } else {
        initScreenshotFeature();
    }
})();
