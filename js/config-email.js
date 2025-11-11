// Configuration Email Module
(function () {
    "use strict";

    // Get elements
    const emailInput = document.getElementById("Email"); // Newsletter email input at the top
    const emailConfigButton = document.getElementById("email-config-button");

    if (!emailInput || !emailConfigButton) {
        console.warn("Configuration email elements not found");
        return;
    }

    // Function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Function to enable/disable button based on email input
    function updateButtonState() {
        const email = emailInput.value.trim();
        if (email && validateEmail(email)) {
            emailConfigButton.disabled = false;
        } else {
            emailConfigButton.disabled = true;
        }
    }

    // Listen for email input changes
    emailInput.addEventListener("input", updateButtonState);
    emailInput.addEventListener("blur", updateButtonState);

    // Initial state check
    updateButtonState();

    // Function to collect configuration data
    function collectConfiguration() {
        const config = {
            model: document.querySelector(".yacht-model")?.textContent || "P43",
            year: document.querySelector(".yacht-year")?.textContent || "2026",
            exterior: {
                model: getSelectedValue("Scegli il Modello Esterno") || "Entrobordo",
                hullColor: getSelectedValue("Carena") || "Bianco",
                waterline: getSelectedValue("Linea di Bellezza") || "",
                hullShell: getSelectedValue("Scafo") || "",
                deck: getSelectedValue("Coperta") || "",
                tTop: getSelectedValue("T-Top") || "",
                cockpit: getSelectedValue("Cockpit") || "Classic Nautical",
                galley: getSelectedValue("Cucina") || "",
                galleyDoors: getSelectedValue("Ante cucina") || "No",
                flooring: getSelectedValue("Pavimentazione") || "Natural Teak with black caulking",
                helmSeats: getSelectedValue("Sedute zona timoneria") || "",
                helmInteriorFabric: getSelectedValue("Tessuto interno sedute guida") || "ICE",
                helmExteriorFabric: getSelectedValue("Tessuto esterno sedute guida") || "ICE",
                exteriorUpholstery: getSelectedValue("Altri sedili esterni") || "ICE",
            },
            interior: {
                model: getSelectedValue("Scegli il Modello Interno") || "Cabin",
                woodFinish: getSelectedValue("Essenza:") || "F000",
                sofaFabric: getSelectedValue("Tessuti divani") || "Taupe",
                carpet: getSelectedValue("Moquette") || "No",
            },
        };

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

    // Function to format configuration as HTML
    function formatConfigurationHTML(config) {
        let html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #262322; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; font-size: 18px; color: #262322; margin-bottom: 10px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 8px; background-color: white; border-left: 3px solid #262322; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Pardo Yacht Configuration</h1>
        </div>
        <div class="content">
            <div class="section">
                <div class="section-title">Model Information</div>
                <div class="field">
                    <div class="label">Model:</div>
                    <div class="value">${config.model} ${config.year}</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Exterior Configuration</div>
                <div class="field">
                    <div class="label">Model:</div>
                    <div class="value">${config.exterior.model}</div>
                </div>
                <div class="field">
                    <div class="label">Hull Color:</div>
                    <div class="value">${config.exterior.hullColor}</div>
                </div>
                <div class="field">
                    <div class="label">Waterline Stripe:</div>
                    <div class="value">${config.exterior.waterline || "Not specified"}</div>
                </div>
                <div class="field">
                    <div class="label">Hull Shell:</div>
                    <div class="value">${config.exterior.hullShell || "Not specified"}</div>
                </div>
                <div class="field">
                    <div class="label">Deck:</div>
                    <div class="value">${config.exterior.deck || "Not specified"}</div>
                </div>
                <div class="field">
                    <div class="label">T-Top:</div>
                    <div class="value">${config.exterior.tTop || "Not specified"}</div>
                </div>
                <div class="field">
                    <div class="label">Cockpit:</div>
                    <div class="value">${config.exterior.cockpit}</div>
                </div>
                <div class="field">
                    <div class="label">Galley:</div>
                    <div class="value">${config.exterior.galley || "Not specified"}</div>
                </div>
                <div class="field">
                    <div class="label">Galley Doors:</div>
                    <div class="value">${config.exterior.galleyDoors}</div>
                </div>
                <div class="field">
                    <div class="label">Flooring:</div>
                    <div class="value">${config.exterior.flooring}</div>
                </div>
                <div class="field">
                    <div class="label">Helm Area Seats:</div>
                    <div class="value">${config.exterior.helmSeats || "Not specified"}</div>
                </div>
                <div class="field">
                    <div class="label">Helm Seat Interior Upholstery:</div>
                    <div class="value">${config.exterior.helmInteriorFabric}</div>
                </div>
                <div class="field">
                    <div class="label">Helm Seat Exterior Upholstery:</div>
                    <div class="value">${config.exterior.helmExteriorFabric}</div>
                </div>
                <div class="field">
                    <div class="label">Exterior Upholstery:</div>
                    <div class="value">${config.exterior.exteriorUpholstery}</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Interior Configuration</div>
                <div class="field">
                    <div class="label">Model:</div>
                    <div class="value">${config.interior.model}</div>
                </div>
                <div class="field">
                    <div class="label">Wood Finish:</div>
                    <div class="value">${config.interior.woodFinish}</div>
                </div>
                <div class="field">
                    <div class="label">Sofa Fabric:</div>
                    <div class="value">${config.interior.sofaFabric}</div>
                </div>
                <div class="field">
                    <div class="label">Carpet:</div>
                    <div class="value">${config.interior.carpet}</div>
                </div>
            </div>
        </div>
        <div style="text-align: center; padding: 20px; color: #777; font-size: 12px;">
            <p>Configuration Date: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
        `.trim();

        return html;
    }

    // Function to send configuration via email
    async function sendConfigurationEmail() {
        const email = emailInput.value.trim();
        if (!email || !validateEmail(email)) {
            alert("Please enter a valid email address first.");
            return;
        }

        // Disable button during sending
        emailConfigButton.disabled = true;
        const originalText = emailConfigButton.textContent;
        emailConfigButton.textContent =
            window.languageSwitcher?.translations[window.languageSwitcher.currentLanguage]?.["Sending..."] ||
            "Sending...";

        try {
            // Collect configuration
            const config = collectConfiguration();

            // Prepare email data
            const emailData = {
                to: email,
                subject: "Your Pardo Yacht Configuration",
                html: formatConfigurationHTML(config),
                text: JSON.stringify(config, null, 2),
            };

            // Send via API (using the same endpoint as contact form)
            const API_ENDPOINT = "https://ic3t88zejk.execute-api.eu-north-1.amazonaws.com/v2/send-email";

            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    first_name: "Configuration",
                    last_name: "Request",
                    residence: "",
                    phone: "",
                    models: config.model,
                    port: "",
                    boat_registration: "",
                    message: "Please find attached my yacht configuration.",
                    marketing_consent: false,
                    profiling_consent: false,
                    configuration: config,
                }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success
                const successMessage =
                    window.languageSwitcher?.translations[window.languageSwitcher.currentLanguage]?.[
                        "Message sent successfully!"
                    ] || "Message sent successfully!";
                alert(successMessage);
            } else {
                throw new Error(result.message || "Failed to send");
            }
        } catch (error) {
            console.error("Error sending configuration:", error);
            const errorMessage =
                window.languageSwitcher?.translations[window.languageSwitcher.currentLanguage]?.[
                    "Failed to send message. Try again."
                ] || "Failed to send message. Try again.";
            alert(errorMessage);
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
