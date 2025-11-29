// Configuration Email Module with PDF Generation
(function () {
    "use strict";

    // ============================================
    // DEBUG MODE: Set to true to download PDF instead of sending email
    // ============================================
    const DEBUG_MODE = false; // Change to true to download PDF for debugging
    // ============================================

    // Get elements
    const emailInput = document.getElementById("Email"); // Newsletter email input at the top
    const emailConfigButton = document.getElementById("email-config-button");
    const contactModal = document.getElementById("contact-modal");
    const contactForm = document.getElementById("contact-form");

    if (!emailInput || !emailConfigButton) {
        alert("Configuration email elements not found");
        return;
    }

    // Create toast status element for PDF email (top right corner)
    let pdfStatusElement = document.getElementById("pdf-email-status");
    if (!pdfStatusElement) {
        pdfStatusElement = document.createElement("div");
        pdfStatusElement.id = "pdf-email-status";
        pdfStatusElement.className = "pdf-email-toast";
        pdfStatusElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-family: "TT-Norms-Pro-Regular", sans-serif;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
            max-width: 400px;
            word-wrap: break-word;
        `;
        document.body.appendChild(pdfStatusElement);
    }

    // Global function to show toast message
    function showToast(message, isSuccess = true) {
        if (!pdfStatusElement) return;

        // Set message and color
        pdfStatusElement.textContent = message;
        pdfStatusElement.style.backgroundColor = isSuccess ? "#4caf50" : "#f44336";
        pdfStatusElement.style.color = "#ffffff";
        pdfStatusElement.style.pointerEvents = "auto";

        // Show toast with animation
        requestAnimationFrame(() => {
            pdfStatusElement.style.opacity = "1";
            pdfStatusElement.style.transform = "translateX(0)";
        });

        // Hide toast after 5 seconds
        setTimeout(() => {
            pdfStatusElement.style.opacity = "0";
            pdfStatusElement.style.transform = "translateX(100%)";
            setTimeout(() => {
                pdfStatusElement.textContent = "";
                pdfStatusElement.style.pointerEvents = "none";
            }, 300); // Wait for animation to complete
        }, 5000);
    }

    // Make showToast globally available
    window.showToast = showToast;

    // Function to get user data from localStorage
    function getUserContactData() {
        try {
            const userData = localStorage.getItem("userContactData");
            return userData ? JSON.parse(userData) : null;
        } catch (e) {
            console.error("Error reading user contact data:", e);
            return null;
        }
    }

    // Function to open contact modal
    function openContactModal() {
        if (contactModal) {
            contactModal.classList.add("show");
            document.body.classList.add("modal-open");
        }
    }

    // Function to close contact modal
    function closeContactModal() {
        if (contactModal) {
            contactModal.classList.remove("show");
            document.body.classList.remove("modal-open");
        }
    }

    // Function to wait for contact form submission
    function waitForContactFormSubmission() {
        return new Promise((resolve) => {
            // Check if data already exists
            const existingData = getUserContactData();
            if (existingData && existingData.email) {
                resolve(existingData);
                return;
            }

            // Open the contact modal
            openContactModal();

            let checkInterval = null;
            let timeoutId = null;
            let handleSubmit = null;

            // Cleanup function
            const cleanup = () => {
                if (checkInterval) clearInterval(checkInterval);
                if (timeoutId) clearTimeout(timeoutId);
                if (contactForm && handleSubmit) {
                    contactForm.removeEventListener("submit", handleSubmit);
                }
            };

            // Listen for localStorage changes (when form is submitted)
            checkInterval = setInterval(() => {
                const userData = getUserContactData();
                if (userData && userData.email) {
                    cleanup();
                    closeContactModal();
                    resolve(userData);
                }
            }, 500);

            // Also listen for form submission event
            if (contactForm) {
                handleSubmit = () => {
                    setTimeout(() => {
                        const userData = getUserContactData();
                        if (userData && userData.email) {
                            cleanup();
                            closeContactModal();
                            resolve(userData);
                        }
                    }, 1000); // Wait a bit for localStorage to be updated
                };
                contactForm.addEventListener("submit", handleSubmit, { once: true });
            }

            // Timeout after 5 minutes
            timeoutId = setTimeout(() => {
                cleanup();
                resolve(null);
            }, 300000);
        });
    }

    // Function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Function to enable/disable button based on email input
    // Track stream ready state
    let isStreamReady = false;

    function updateButtonState() {
        const email = emailInput.value.trim();
        const emailValid = email && validateEmail(email);

        // Button is enabled only when email is valid AND stream is ready
        if (emailValid && isStreamReady) {
            emailConfigButton.disabled = false;
        } else {
            emailConfigButton.disabled = true;
        }
    }

    // Check if stream is ready
    function checkStreamReady() {
        if (typeof window.cloudstream !== "undefined") {
            // Stream API is available, but we need to wait for streamReady event
            // This will be set by the event listener below
            return isStreamReady;
        }
        return false;
    }

    // Listen for stream ready event
    function initStreamReadyListener() {
        if (typeof window.cloudstream !== "undefined") {
            window.cloudstream.addEventListener("streamReady", () => {
                console.log("Stream is ready - enabling email config button");
                isStreamReady = true;
                updateButtonState();
            });
        } else {
            // Retry if cloudstream is not yet available
            setTimeout(initStreamReadyListener, 500);
        }
    }

    // Initialize stream ready listener
    initStreamReadyListener();

    // Load email from localStorage if available
    function loadEmailFromStorage() {
        const userData = getUserContactData();
        if (userData && userData.email) {
            emailInput.value = userData.email;
            updateButtonState();
        }
    }

    // Listen for email input changes
    emailInput.addEventListener("input", updateButtonState);
    emailInput.addEventListener("blur", updateButtonState);

    // Listen for localStorage changes to update email input
    // Note: storage event only fires in other tabs/windows, so we also listen for custom event
    window.addEventListener("storage", (e) => {
        if (e.key === "userContactData") {
            loadEmailFromStorage();
        }
    });

    // Listen for custom event when localStorage is updated in same tab
    window.addEventListener("userContactDataUpdated", () => {
        loadEmailFromStorage();
    });

    // Initial state check and load from storage
    loadEmailFromStorage();

    // Initially disable button until stream is ready
    emailConfigButton.disabled = true;
    updateButtonState();

    // Helper function to get translation
    function getLoaderTranslation(key) {
        if (window.languageSwitcher) {
            const lang = window.languageSwitcher.currentLanguage;
            return window.languageSwitcher.translations[lang]?.[key] || key;
        }
        return key;
    }

    // Create loader element
    function createLoader() {
        const loader = document.createElement("div");
        loader.id = "pdf-loader";
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            color: #333;
            font-family: Arial, sans-serif;
        `;

        // Get translated texts
        const generatingText = getLoaderTranslation("Generating PDF...");
        const waitingText = getLoaderTranslation("Please wait while we create your configuration");

        loader.innerHTML = `
            <div style="
                position: relative;
                text-align: center;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            ">
                <!-- Background image -->
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    background-image: url('img/yachts/43.webp');
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    opacity: 1;
                    z-index: 0;
                "></div>
                
                <!-- Spinner and text (above background) -->
                <div style="position: relative; z-index: 1; margin-top: 230px;">
                    <div style="
                        border: 4px solid rgba(0, 0, 0, 0.1);
                        border-top: 4px solid #262322;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    "></div>
                    <p style="font-size: 21px; margin: 0; color: #262322;">${generatingText}</p>
                    <p style="font-size: 18px; margin-top: 10px; color: #666;">${waitingText}</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loader);
        return loader;
    }

    // Remove loader
    function removeLoader() {
        const loader = document.getElementById("pdf-loader");
        if (loader) {
            loader.remove();
        }
    }

    // Function to collect all configuration data from sidebar
    function collectAllConfiguration() {
        const config = {
            model: document.querySelector(".yacht-model")?.textContent || "P43",
            year: document.querySelector(".yacht-year")?.textContent || "2026",
            exterior: {},
            interior: {},
        };

        // Collect all exterior options
        const exteriorSections = document.querySelectorAll(".exterior-scenes .scene-type");
        exteriorSections.forEach((section) => {
            const sectionLabel = section.textContent.trim();
            const container = section.nextElementSibling?.nextElementSibling;
            if (container) {
                const activeElement = container.querySelector(
                    ".active, .img-wrapper.active, .texture-wrapper.active, input[type='radio']:checked"
                );
                if (activeElement) {
                    const value =
                        activeElement.getAttribute("data-name") ||
                        activeElement.getAttribute("data-mat") ||
                        activeElement.value ||
                        activeElement.textContent?.trim();
                    if (value) {
                        config.exterior[sectionLabel] = value;
                    }
                }
            }
        });

        // Collect specific exterior options
        config.exterior.model = getSelectedValue("Scegli il Modello Esterno") || "Entrobordo";
        config.exterior.hullColor = getSelectedValue("Scafo") || "Grey LINX LZ7S";
        config.exterior.waterline = getSelectedValue("Linea di Bellezza") || "Grey LINX LZ7S";
        config.exterior.carena = getSelectedValue("Carena") || "Bianco";
        config.exterior.deck = getSelectedValue("Coperta") || "Grey LINX LZ7S";
        config.exterior.tTop = getSelectedValue("T-Top") || "Grey LINX LZ7S";

        // Cockpit (radio buttons)
        const cockpitRadio = document.querySelector('input[name="cockpit"]:checked');
        config.exterior.cockpit = cockpitRadio ? cockpitRadio.value : "Classic";

        config.exterior.galley = getSelectedValue("Cucina") || "Grey LINX LZ7S";

        // Ante cucina (radio buttons)
        const anteCucinaRadio = document.querySelector('input[name="antecucina"]:checked');
        config.exterior.galleyDoors = anteCucinaRadio ? (anteCucinaRadio.value === "Yes" ? "Si" : "No") : "Si";

        config.exterior.flooring = getSelectedValue("Pavimentazione") || "Natural Teak with black caulking";
        config.exterior.helmSeats = getSelectedValue("Sedute zona timoneria") || "";
        config.exterior.helmInteriorFabric = getSelectedValue("Tessuto interno sedute guida") || "ICE";
        config.exterior.helmExteriorFabric = getSelectedValue("Tessuto esterno sedute guida") || "ICE";
        config.exterior.exteriorUpholstery = getSelectedValue("Altri sedili esterni") || "ICE";

        // Collect interior options
        const interiorSections = document.querySelectorAll(".interior-scenes .scene-type");
        interiorSections.forEach((section) => {
            const sectionLabel = section.textContent.trim();
            const container = section.nextElementSibling?.nextElementSibling;
            if (container) {
                const activeElement = container.querySelector(".active, .img-wrapper.active, .texture-wrapper.active");
                if (activeElement) {
                    const value =
                        activeElement.getAttribute("data-name") ||
                        activeElement.getAttribute("data-mat") ||
                        activeElement.getAttribute("data-moq");
                    if (value) {
                        config.interior[sectionLabel] = value;
                    }
                }
            }
        });

        config.interior.model = getSelectedValue("Scegli il Modello Interno") || "Cabin";
        config.interior.woodFinish = getSelectedValue("Essenza:") || "F000";
        config.interior.sofaFabric = getSelectedValue("Tessuti divani") || "Taupe";
        config.interior.carpet = getSelectedValue("Moquette") || "No";

        return config;
    }

    // Helper function to get selected value for a section
    function getSelectedValue(sectionLabel) {
        // Find the section by label
        const section = Array.from(document.querySelectorAll(".scene-type")).find(
            (el) => el.textContent.includes(sectionLabel) || el.getAttribute("data-translate") === sectionLabel
        );

        if (!section) return null;

        // Find the active selection in that section
        const container = section.nextElementSibling?.nextElementSibling;
        if (!container) return null;

        // Check for active elements
        const activeElement = container.querySelector(".active, .img-wrapper.active, .texture-wrapper.active");
        if (activeElement) {
            return (
                activeElement.getAttribute("data-name") ||
                activeElement.getAttribute("data-mat") ||
                activeElement.getAttribute("data-moq") ||
                null
            );
        }

        // Fallback to scene-label
        const sceneLabel = section.nextElementSibling;
        if (sceneLabel && sceneLabel.classList.contains("scene-label")) {
            return sceneLabel.textContent.trim();
        }

        return null;
    }

    // Function to convert image to base64
    function imageToBase64(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                try {
                    resolve(canvas.toDataURL("image/png"));
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    // Function to get translation
    function getTranslation(key, defaultValue = key) {
        if (window.languageSwitcher && window.languageSwitcher.translations) {
            const lang = window.languageSwitcher.currentLanguage || "en";
            const translations = window.languageSwitcher.translations[lang];
            if (translations && translations[key]) {
                return translations[key];
            }
        }
        return defaultValue;
    }

    // PDF translations
    const pdfTranslations = {
        en: {
            length: "Length: 14 m | 45.93 ft",
            maxBeam: "Max. Beam: 4.20 m | 13.78 ft",
            displacement: "Displacement: 11.7 t | 23400 lb",
            description:
                "Since its debut, the Pardo 43 has rewritten the rules of the international yachting market, becoming a true Made in Italy icon of style and performance, while preserving its timeless, contemporary appeal.",
            exteriorConfiguration: "Exterior Configuration",
            interiorConfiguration: "Interior Configuration",
            cameraViews: "Camera Views",
            model: "Model",
            hullColor: "Hull Color (Scafo)",
            waterline: "Waterline (Linea di Bellezza)",
            carena: "Carena",
            deck: "Deck (Coperta)",
            tTop: "T-Top",
            cockpit: "Cockpit",
            galley: "Galley (Cucina)",
            galleyDoors: "Galley Doors (Ante cucina)",
            flooring: "Flooring (Pavimentazione)",
            helmSeats: "Helm Seats",
            helmInteriorFabric: "Helm Interior Fabric",
            helmExteriorFabric: "Helm Exterior Fabric",
            exteriorUpholstery: "Exterior Upholstery",
            woodFinish: "Wood Finish (Essenza)",
            sofaFabric: "Sofa Fabric (Tessuti divani)",
            carpet: "Carpet (Moquette)",
            notSpecified: "Not specified",
            configurationDate: "Configuration Date",
            page: "Page",
            of: "of",
            camera: "Camera",
            imageUnavailable: "image unavailable",
            // Camera names translations
            Orbit: "Orbit",
            Prua: "Bow",
            Poppa: "Stern",
            Driver: "Driver",
            Interior: "Interior",
            InteriorOpposite: "Interior Opposite",
            // Configuration values
            Entrobordo: "Inboard",
            Fuoribordo: "Outboard",
            Classic: "Classic",
            Nautical: "Nautical",
            Cabin: "Cabin",
            Yes: "Yes",
            No: "No",
            Si: "Yes", // Italian "Si" translates to "Yes"
        },
        it: {
            length: "Lunghezza: 14 m | 45.93 ft",
            maxBeam: "Larghezza max: 4.20 m | 13.78 ft",
            displacement: "Dislocamento: 11.7 t | 23400 lb",
            description:
                "Dal suo debutto, il Pardo 43 ha riscritto le regole del mercato nautico internazionale, diventando una vera icona del Made in Italy per stile e prestazioni, preservando il suo fascino senza tempo e contemporaneo.",
            exteriorConfiguration: "Configurazione Esterna",
            interiorConfiguration: "Configurazione Interna",
            cameraViews: "Viste Camera",
            model: "Modello",
            hullColor: "Colore Scafo",
            waterline: "Linea di Galleggiamento",
            carena: "Carena",
            deck: "Coperta",
            tTop: "T-Top",
            cockpit: "Cockpit",
            galley: "Cucina",
            galleyDoors: "Ante Cucina",
            flooring: "Pavimentazione",
            helmSeats: "Sedute Zona Timoneria",
            helmInteriorFabric: "Tessuto Interno Sedute Guida",
            helmExteriorFabric: "Tessuto Esterno Sedute Guida",
            exteriorUpholstery: "Altri Sedili Esterni",
            woodFinish: "Essenza",
            sofaFabric: "Tessuti Divani",
            carpet: "Moquette",
            notSpecified: "Non specificato",
            configurationDate: "Data Configurazione",
            page: "Pagina",
            of: "di",
            camera: "Camera",
            imageUnavailable: "immagine non disponibile",
            // Camera names translations
            Orbit: "Orbit",
            Prua: "Prua",
            Poppa: "Poppa",
            Driver: "Timoneria",
            Interior: "Interno",
            InteriorOpposite: "Interno Opposto",
            // Configuration values
            Entrobordo: "Entrobordo",
            Fuoribordo: "Fuoribordo",
            Classic: "Classic",
            Nautical: "Nautical",
            Cabin: "Cabin",
            Yes: "Si",
            No: "No",
        },
    };

    // Function to get PDF translation
    function getPdfTranslation(key) {
        const lang = window.languageSwitcher?.currentLanguage || "en";
        const translations = pdfTranslations[lang] || pdfTranslations.en;
        return translations[key] || key;
    }

    // Function to translate configuration value
    function translateConfigValue(value) {
        if (!value || value === "Not specified") return getPdfTranslation("notSpecified");

        // First try PDF translations (for specific values like Yes/No, Entrobordo, etc.)
        const pdfTranslation = getPdfTranslation(value);
        if (pdfTranslation !== value) {
            return pdfTranslation;
        }

        // Then try to get translation from language switcher
        const translation = getTranslation(value, value);
        return translation;
    }

    // Function to generate PDF
    async function generatePDF(config, screenshots) {
        return new Promise(async (resolve, reject) => {
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                });

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const margin = 15;
                let yPos = margin;

                // Helper function to center text
                const centerText = (text, y, fontSize = null) => {
                    if (fontSize) doc.setFontSize(fontSize);
                    const textWidth = doc.getTextWidth(text);
                    const x = (pageWidth - textWidth) / 2;
                    doc.text(text, x, y);
                };

                // Add logo (center aligned)
                try {
                    // Try to load logo JPG
                    const logoImg = await imageToBase64("img/logo.jpg").catch(() => null);
                    if (logoImg) {
                        const logoWidth = 40;
                        const logoHeight = 10;
                        const logoX = (pageWidth - logoWidth) / 2;
                        doc.addImage(logoImg, "JPEG", logoX, yPos, logoWidth, logoHeight);
                        yPos += logoHeight + 10;
                    } else {
                        // Fallback: text logo (centered)
                        doc.setFontSize(20);
                        doc.setTextColor(38, 35, 34); // #262322
                        centerText("PARDO YACHTS", yPos + 8, 20);
                        yPos += 20;
                    }
                } catch (e) {
                    // Fallback: text logo (centered)
                    doc.setFontSize(20);
                    doc.setTextColor(38, 35, 34);
                    centerText("PARDO YACHTS", yPos + 8, 20);
                    yPos += 20;
                }

                // Title (centered)
                doc.setFontSize(24);
                doc.setTextColor(38, 35, 34);
                centerText(`${config.model} ${config.year}`, yPos, 24);
                yPos += 10;

                // Yacht info section (centered)
                doc.setFontSize(12);
                doc.setTextColor(100, 100, 100);
                centerText(getPdfTranslation("length"), yPos, 12);
                yPos += 6;
                centerText(getPdfTranslation("maxBeam"), yPos, 12);
                yPos += 6;
                centerText(getPdfTranslation("displacement"), yPos, 12);
                yPos += 10;

                // Description (centered)
                doc.setFontSize(10);
                doc.setTextColor(60, 60, 60);
                const description = getPdfTranslation("description");
                const splitDesc = doc.splitTextToSize(description, pageWidth - 2 * margin);
                const descHeight = splitDesc.length * 5;
                const descY = yPos;
                splitDesc.forEach((line, index) => {
                    centerText(line, descY + index * 5, 10);
                });
                yPos += descHeight + 10;

                // Add yacht image before configurations (centered)
                try {
                    const yachtImg = await imageToBase64("img/yachts/43.webp").catch(() => null);
                    if (yachtImg) {
                        // Check if we need a new page
                        if (yPos > pageHeight - 100) {
                            doc.addPage();
                            yPos = margin;
                        }

                        const imgWidth = pageWidth - 2 * margin;
                        const imgHeight = 90; // Increased height for landscape image (was 60)
                        const imgX = margin; // Already centered since it uses full width minus margins

                        doc.addImage(yachtImg, "JPEG", imgX, yPos, imgWidth, imgHeight);
                        yPos += imgHeight + 15;
                    }
                } catch (e) {
                    console.warn("Could not load yacht image:", e);
                }

                // Exterior Configuration Section
                doc.setFontSize(16);
                doc.setTextColor(38, 35, 34);
                doc.text(getPdfTranslation("exteriorConfiguration"), margin, yPos);
                yPos += 8;

                doc.setFontSize(10);
                doc.setTextColor(60, 60, 60);
                const exteriorFields = [
                    [getPdfTranslation("model"), translateConfigValue(config.exterior.model)],
                    [getPdfTranslation("hullColor"), translateConfigValue(config.exterior.hullColor)],
                    [getPdfTranslation("waterline"), translateConfigValue(config.exterior.waterline)],
                    [getPdfTranslation("carena"), translateConfigValue(config.exterior.carena)],
                    [getPdfTranslation("deck"), translateConfigValue(config.exterior.deck)],
                    [getPdfTranslation("tTop"), translateConfigValue(config.exterior.tTop)],
                    [getPdfTranslation("cockpit"), translateConfigValue(config.exterior.cockpit)],
                    [getPdfTranslation("galley"), translateConfigValue(config.exterior.galley)],
                    [getPdfTranslation("galleyDoors"), translateConfigValue(config.exterior.galleyDoors)],
                    [getPdfTranslation("flooring"), translateConfigValue(config.exterior.flooring)],
                    [
                        getPdfTranslation("helmSeats"),
                        translateConfigValue(config.exterior.helmSeats) || getPdfTranslation("notSpecified"),
                    ],
                    [getPdfTranslation("helmInteriorFabric"), translateConfigValue(config.exterior.helmInteriorFabric)],
                    [getPdfTranslation("helmExteriorFabric"), translateConfigValue(config.exterior.helmExteriorFabric)],
                    [getPdfTranslation("exteriorUpholstery"), translateConfigValue(config.exterior.exteriorUpholstery)],
                ];

                exteriorFields.forEach(([label, value]) => {
                    if (yPos > pageHeight - 20) {
                        doc.addPage();
                        yPos = margin;
                    }
                    doc.setFont("helvetica", "bold");
                    doc.text(label + ":", margin, yPos);
                    doc.setFont("helvetica", "normal");
                    doc.text(value, margin + 60, yPos);
                    yPos += 6;
                });

                yPos += 5;

                // Interior Configuration Section
                if (yPos > pageHeight - 30) {
                    doc.addPage();
                    yPos = margin;
                }

                doc.setFontSize(16);
                doc.setTextColor(38, 35, 34);
                doc.text(getPdfTranslation("interiorConfiguration"), margin, yPos);
                yPos += 8;

                doc.setFontSize(10);
                doc.setTextColor(60, 60, 60);
                const interiorFields = [
                    [getPdfTranslation("model"), translateConfigValue(config.interior.model)],
                    [getPdfTranslation("woodFinish"), translateConfigValue(config.interior.woodFinish)],
                    [getPdfTranslation("sofaFabric"), translateConfigValue(config.interior.sofaFabric)],
                    [getPdfTranslation("carpet"), translateConfigValue(config.interior.carpet)],
                ];

                interiorFields.forEach(([label, value]) => {
                    if (yPos > pageHeight - 20) {
                        doc.addPage();
                        yPos = margin;
                    }
                    doc.setFont("helvetica", "bold");
                    doc.text(label + ":", margin, yPos);
                    doc.setFont("helvetica", "normal");
                    doc.text(value, margin + 60, yPos);
                    yPos += 6;
                });

                yPos += 10;

                // Add screenshots (max 2 per page)
                if (screenshots && screenshots.length > 0) {
                    if (yPos > pageHeight - 50) {
                        doc.addPage();
                        yPos = margin;
                    }

                    doc.setFontSize(16);
                    doc.setTextColor(38, 35, 34);
                    doc.text(getPdfTranslation("cameraViews"), margin, yPos);
                    yPos += 10;

                    let screenshotsOnCurrentPage = 0;
                    const maxScreenshotsPerPage = 2;

                    for (let i = 0; i < screenshots.length; i++) {
                        const screenshot = screenshots[i];

                        // Start new page if we have 2 screenshots on current page
                        if (screenshotsOnCurrentPage >= maxScreenshotsPerPage) {
                            doc.addPage();
                            yPos = margin;
                            screenshotsOnCurrentPage = 0;
                        }

                        // Also check if we need a new page based on available space
                        const estimatedScreenshotHeight = 100 + 15; // maxHeight + label + spacing
                        if (yPos + estimatedScreenshotHeight > pageHeight - 20) {
                            doc.addPage();
                            yPos = margin;
                            screenshotsOnCurrentPage = 0;
                        }

                        try {
                            // Convert blob to base64
                            const base64 = await new Promise((resolve, reject) => {
                                if (!screenshot.blob) {
                                    // Try to load from URL if blob is not available
                                    if (screenshot.url) {
                                        imageToBase64(screenshot.url).then(resolve).catch(reject);
                                    } else {
                                        reject(new Error("No blob or URL available"));
                                    }
                                    return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result);
                                reader.onerror = reject;
                                reader.readAsDataURL(screenshot.blob);
                            });

                            // Calculate image dimensions (maintain aspect ratio)
                            const imgWidth = pageWidth - 2 * margin;
                            const maxHeight = 100; // Increased by 2x (was 50)

                            // Try to get actual image dimensions
                            let imgHeight = maxHeight;
                            try {
                                const img = new Image();
                                await new Promise((resolve, reject) => {
                                    img.onload = () => {
                                        if (img.width && img.height) {
                                            const aspectRatio = img.height / img.width;
                                            imgHeight = Math.min(imgWidth * aspectRatio, maxHeight);
                                        }
                                        resolve();
                                    };
                                    img.onerror = resolve; // Continue even if image fails to load
                                    img.src = base64;
                                });
                            } catch (e) {
                                // Use default height if image loading fails
                                console.warn("Could not determine image dimensions:", e);
                            }

                            doc.addImage(base64, "JPEG", margin, yPos, imgWidth, imgHeight);
                            doc.setFontSize(9);
                            doc.setTextColor(100, 100, 100);
                            // Translate camera name
                            const cameraName = screenshot.cameraName
                                ? getPdfTranslation(screenshot.cameraName) || screenshot.cameraName
                                : `${getPdfTranslation("camera")} ${i + 1}`;
                            doc.text(cameraName, margin, yPos + imgHeight + 5);
                            yPos += imgHeight + 15; // Increased spacing
                            screenshotsOnCurrentPage++;
                        } catch (e) {
                            console.error("Error adding screenshot to PDF:", e);
                            // Add text placeholder if image fails
                            doc.setFontSize(9);
                            doc.setTextColor(150, 150, 150);
                            const cameraName = screenshot.cameraName
                                ? getPdfTranslation(screenshot.cameraName) || screenshot.cameraName
                                : `${getPdfTranslation("camera")} ${i + 1}`;
                            doc.text(`${cameraName} (${getPdfTranslation("imageUnavailable")})`, margin, yPos);
                            yPos += 8;
                            screenshotsOnCurrentPage++;
                        }
                    }
                }

                // Footer
                const totalPages = doc.internal.pages.length - 1;
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    const dateLabel = getPdfTranslation("configurationDate");
                    const dateStr = new Date().toLocaleDateString(
                        window.languageSwitcher?.currentLanguage === "it" ? "it-IT" : "en-US"
                    );
                    doc.text(`${dateLabel}: ${dateStr}`, margin, pageHeight - 10);
                    doc.text(
                        `${getPdfTranslation("page")} ${i} ${getPdfTranslation("of")} ${totalPages}`,
                        pageWidth - margin - 20,
                        pageHeight - 10
                    );
                }

                // Generate PDF blob
                const pdfBlob = doc.output("blob");
                resolve(pdfBlob);
            } catch (error) {
                console.error("Error generating PDF:", error);
                reject(error);
            }
        });
    }

    // Function to send configuration via email with PDF
    async function sendConfigurationEmail() {
        // Check if user contact data exists in localStorage
        let userData = getUserContactData();
        let email = emailInput.value.trim();

        // If no email in input and no userData, open contact form
        if ((!email || !validateEmail(email)) && !userData) {
            // Show message and open contact form
            alert("Please fill in the contact form first to provide your email address.");
            userData = await waitForContactFormSubmission();

            if (!userData || !userData.email) {
                alert("Contact form was not completed. Please try again.");
                return;
            }

            // Update email input with data from localStorage
            email = userData.email;
            emailInput.value = email;
            updateButtonState();
        } else if (userData && userData.email) {
            // Use email from localStorage if available
            email = userData.email;
            emailInput.value = email;
            updateButtonState();
        } else if (!email || !validateEmail(email)) {
            alert("Please enter a valid email address first.");
            return;
        }

        // Disable button and show loader
        // Clear previous toast (if any)
        if (pdfStatusElement) {
            pdfStatusElement.style.opacity = "0";
            pdfStatusElement.style.transform = "translateX(100%)";
            setTimeout(() => {
                pdfStatusElement.textContent = "";
            }, 300);
        }

        emailConfigButton.disabled = true;
        const originalText = emailConfigButton.textContent;
        emailConfigButton.textContent =
            window.languageSwitcher?.translations[window.languageSwitcher.currentLanguage]?.["Generating..."] ||
            "Generating...";

        const loader = createLoader();

        try {
            // Collect configuration
            const config = collectAllConfiguration();

            // Capture screenshots (hidden from user by loader overlay)
            let screenshots = [];
            if (typeof window.captureAllCameras === "function") {
                try {
                    screenshots = await window.captureAllCameras(false); // false = don't download
                } catch (error) {
                    console.warn("Could not capture screenshots:", error);
                }
            }

            // Update loader message
            if (loader) {
                const messageParagraphs = loader.querySelectorAll("p");
                if (messageParagraphs.length > 0) {
                    // Update first paragraph (main message)
                    messageParagraphs[0].textContent = getLoaderTranslation("Creating PDF...");
                    // Keep second paragraph (waiting text) as is
                }
            }

            // Generate PDF
            const pdfBlob = await generatePDF(config, screenshots);

            // DEBUG MODE: Download PDF instead of sending email
            if (DEBUG_MODE) {
                // Remove loader
                removeLoader();

                // Download PDF
                const pdfUrl = URL.createObjectURL(pdfBlob);
                const link = document.createElement("a");
                link.href = pdfUrl;
                link.download = `Pardo_${config.model}_${config.year}_Configuration_${Date.now()}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up URL after a delay
                setTimeout(() => {
                    URL.revokeObjectURL(pdfUrl);
                }, 100);

                // Show success message
                alert("PDF downloaded successfully! (DEBUG MODE)");
                console.log("PDF downloaded in DEBUG MODE. Configuration:", config);
                return;
            }

            // Update loader message
            if (loader) {
                const messageParagraphs = loader.querySelectorAll("p");
                if (messageParagraphs.length > 0) {
                    // Update first paragraph (main message)
                    messageParagraphs[0].textContent = getLoaderTranslation("Sending email...");
                    // Keep second paragraph (waiting text) as is
                }
            }

            // Convert PDF to base64 for sending
            const pdfBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result.split(",")[1]; // Remove data:application/pdf;base64, prefix
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(pdfBlob);
            });

            // Get user data from localStorage for email
            const finalUserData = getUserContactData();

            // Send via API with PDF attachment
            const API_ENDPOINT = "https://ic3t88zejk.execute-api.eu-north-1.amazonaws.com/v2/send-email";

            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    first_name: finalUserData?.first_name || "Configuration",
                    last_name: finalUserData?.last_name || "Request",
                    residence: finalUserData?.residence || "",
                    phone: finalUserData?.phone || "",
                    models: config.model,
                    port: "",
                    boat_registration: "",
                    message: "Please find attached my yacht configuration PDF.",
                    marketing_consent: false,
                    profiling_consent: false,
                    configuration: config,
                    pdf_attachment: pdfBase64,
                    pdf_filename: `Pardo_${config.model}_${config.year}_Configuration_${Date.now()}.pdf`,
                }),
            });

            const result = await response.json();

            // Remove loader
            removeLoader();

            if (response.ok && result.success) {
                // Success - show toast message
                const successMessage = window.languageSwitcher
                    ? window.languageSwitcher.translations[window.languageSwitcher.currentLanguage][
                          "Configuration sent successfully!"
                      ] || "Configuration sent successfully!"
                    : "Configuration sent successfully!";
                showToast(successMessage, true);
            } else {
                throw new Error(result.message || "Failed to send");
            }
        } catch (error) {
            console.error("Error sending configuration:", error);
            removeLoader();
            // Error - show toast message
            const errorMessage = window.languageSwitcher
                ? window.languageSwitcher.translations[window.languageSwitcher.currentLanguage][
                      "Failed to send configuration. Try again."
                  ] || "Failed to send configuration. Try again."
                : "Failed to send configuration. Try again.";
            showToast(errorMessage, false);
        } finally {
            // Re-enable button
            emailConfigButton.disabled = false;
            emailConfigButton.textContent = originalText;
            updateButtonState(); // Re-check email validity
        }
    }

    // Add click event listener
    emailConfigButton.addEventListener("click", sendConfigurationEmail);
})();
