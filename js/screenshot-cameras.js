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
                            (blob) => {
                                if (blob) {
                                    const url = URL.createObjectURL(blob);
                                    resolve({ url, cameraName, blob });
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
                        tempCanvas.width = video.videoWidth || video.clientWidth;
                        tempCanvas.height = video.videoHeight || video.clientHeight;
                        const ctx = tempCanvas.getContext("2d");
                        ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

                        tempCanvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    const url = URL.createObjectURL(blob);
                                    resolve({ url, cameraName, blob });
                                } else {
                                    reject(new Error("Failed to create blob from video"));
                                }
                            },
                            "image/png",
                            1.0
                        );
                    } else {
                        // Fallback: use html2canvas if available, or try to capture the container
                        if (typeof html2canvas !== "undefined") {
                            html2canvas(streamContainer, {
                                backgroundColor: null,
                                useCORS: true,
                                logging: false,
                            }).then((canvas) => {
                                canvas.toBlob(
                                    (blob) => {
                                        if (blob) {
                                            const url = URL.createObjectURL(blob);
                                            resolve({ url, cameraName, blob });
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
        async function captureAllCameras() {
            const screenshots = [];
            const originalCamera = document.querySelector(".camera.active")?.dataset.camera;

            console.log("Starting screenshot capture for all cameras...");

            for (let i = 0; i < cameraNames.length; i++) {
                const cameraName = cameraNames[i];
                console.log(`Capturing ${cameraName} (${i + 1}/${cameraNames.length})...`);

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

            // Download all screenshots
            screenshots.forEach((screenshot, index) => {
                const link = document.createElement("a");
                link.href = screenshot.url;
                link.download = `screenshot_${screenshot.cameraName}_${Date.now()}_${index + 1}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up URL after a delay
                setTimeout(() => {
                    URL.revokeObjectURL(screenshot.url);
                }, 100);
            });

            console.log(`✓ All screenshots captured and downloaded (${screenshots.length}/${cameraNames.length})`);
            return screenshots;
        }

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
