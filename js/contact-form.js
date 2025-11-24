// Contact Form Modal Module
(function () {
    "use strict";

    // --- Modal logic ---
    const modal = document.getElementById("contact-modal");
    const closeBtn = document.querySelector(".contact-close");
    const overlay = document.querySelector(".contact-overlay");
    const form = document.getElementById("contact-form");

    if (!modal || !closeBtn || !overlay || !form) {
        console.warn("Contact form elements not found");
        return;
    }

    // Show on first visit
    if (!localStorage.getItem("contactShown")) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                openModal();
            }, 500);
        });
    }

    function openModal() {
        modal.classList.add("show");
        document.body.classList.add("modal-open");
    }

    function closeModal() {
        modal.classList.remove("show");
        document.body.classList.remove("modal-open");
        // Save to localStorage so modal won't show again
        localStorage.setItem("contactShown", "true");
    }

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });

    // --- Form validation ---
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validateField(fieldId, errorId, value, isEmail = false, isRequired = false) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);

        if (!field || !error) return false;

        if (isRequired && (!value || value.trim() === "")) {
            field.classList.add("error");
            error.textContent = "";
            return false;
        }

        if (isEmail && value && !validateEmail(value)) {
            field.classList.add("error");
            if (window.languageSwitcher) {
                const lang = window.languageSwitcher.currentLanguage;
                error.textContent =
                    window.languageSwitcher.translations[lang]["Please enter a valid email address."] ||
                    "Please enter a valid email address.";
            } else {
                error.textContent = "Please enter a valid email address.";
            }
            return false;
        }

        field.classList.remove("error");
        error.textContent = "";
        return true;
    }

    // Character counter for message textarea
    const messageField = document.getElementById("message");
    const charCount = document.getElementById("charCount");
    if (messageField && charCount) {
        messageField.addEventListener("input", () => {
            const count = messageField.value.length;
            charCount.textContent = count;
        });
    }

    // Model dropdown functionality
    const dropdownToggle = document.getElementById("dropdown-toggle");
    const dropdownContainer = document.getElementById("dropdown-container");
    const dropdownArrow = document.getElementById("dropdown-arrow");
    const placeholderText = document.getElementById("placeholder-text");
    const badgeProducts = document.querySelectorAll(".badge-product");
    const selectedModelsInput = document.getElementById("selected-models");

    let selectedModels = [];

    if (dropdownToggle && dropdownContainer) {
        dropdownToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdownContainer.classList.toggle("open");
            if (dropdownArrow) {
                dropdownArrow.classList.toggle("rotated");
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!dropdownToggle.contains(e.target) && !dropdownContainer.contains(e.target)) {
                dropdownContainer.classList.remove("open");
                if (dropdownArrow) {
                    dropdownArrow.classList.remove("rotated");
                }
            }
        });
    }

    // Badge selection
    badgeProducts.forEach((badge) => {
        badge.addEventListener("click", (e) => {
            e.stopPropagation();
            badge.classList.toggle("chips-label-active");
            const value = badge.getAttribute("data-value");

            if (badge.classList.contains("chips-label-active")) {
                if (!selectedModels.includes(value)) {
                    selectedModels.push(value);
                }
            } else {
                selectedModels = selectedModels.filter((m) => m !== value);
            }

            // Update hidden input
            if (selectedModelsInput) {
                selectedModelsInput.value = selectedModels.join(", ");
            }

            // Update placeholder
            if (placeholderText) {
                if (selectedModels.length > 0) {
                    placeholderText.textContent = selectedModels.join(", ");
                } else {
                    if (window.languageSwitcher) {
                        const lang = window.languageSwitcher.currentLanguage;
                        placeholderText.textContent =
                            window.languageSwitcher.translations[lang]["Model of Interest"] || "Modello di interesse";
                    } else {
                        placeholderText.textContent = "Modello di interesse";
                    }
                }
            }
        });
    });

    // Check required fields and enable/disable submit button
    function checkRequiredFields() {
        const submitBtn = document.querySelector(".btn-submit");
        if (!submitBtn) return;

        const firstName = document.getElementById("first_name")?.value.trim() || "";
        const lastName = document.getElementById("last_name")?.value.trim() || "";
        const residence = document.getElementById("residence")?.value.trim() || "";
        const email = document.getElementById("email")?.value.trim() || "";
        const phone = document.getElementById("phone")?.value.trim() || "";
        const marketingConsent = document.getElementById("marketingConsent")?.checked || false;
        const profilingConsent = document.getElementById("profilingConsent")?.checked || false;

        // Validate email format
        const emailValid = email && validateEmail(email);

        // Check if all required fields are filled
        // At least one privacy consent checkbox must be checked
        const privacyConsentValid = marketingConsent || profilingConsent;

        const allFilled = firstName && lastName && residence && emailValid && phone && privacyConsentValid;

        submitBtn.disabled = !allFilled;
    }

    // Add event listeners for required fields
    const requiredFields = ["first_name", "last_name", "residence", "email", "phone"];
    requiredFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener("input", checkRequiredFields);
            field.addEventListener("blur", () => {
                const isEmail = fieldId === "email";
                validateField(fieldId, `${fieldId}-error`, field.value, isEmail, true);
                checkRequiredFields();
            });
        }
    });

    // Add event listeners for privacy consent checkboxes
    const marketingCheckbox = document.getElementById("marketingConsent");
    const profilingCheckbox = document.getElementById("profilingConsent");

    if (marketingCheckbox) {
        marketingCheckbox.addEventListener("change", checkRequiredFields);
    }
    if (profilingCheckbox) {
        profilingCheckbox.addEventListener("change", checkRequiredFields);
    }

    // Initial check
    checkRequiredFields();

    // --- Form submission ---
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const status = document.getElementById("form-status");
        const submitBtn = document.querySelector(".btn-submit");

        // Validate all fields
        const firstName = document.getElementById("first_name").value.trim();
        const lastName = document.getElementById("last_name").value.trim();
        const residence = document.getElementById("residence").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const port = document.getElementById("port").value.trim();
        const boatRegistration = document.getElementById("boat_registration").value.trim();
        const message = document.getElementById("message").value.trim();
        const marketingConsent = document.getElementById("marketingConsent").checked;
        const profilingConsent = document.getElementById("profilingConsent").checked;

        // Validate required fields
        let isValid = true;
        isValid = validateField("first_name", "first_name-error", firstName, false, true) && isValid;
        isValid = validateField("last_name", "last_name-error", lastName, false, true) && isValid;
        isValid = validateField("residence", "residence-error", residence, false, true) && isValid;
        isValid = validateField("email", "email-error", email, true, true) && isValid;
        isValid = validateField("phone", "phone-error", phone, false, true) && isValid;

        // Validate privacy consent (at least one checkbox must be checked)
        const privacyConsentValid = marketingConsent || profilingConsent;
        if (!privacyConsentValid) {
            isValid = false;
            const marketingError = document.getElementById("marketingConsent-error");
            const profilingError = document.getElementById("profilingConsent-error");
            if (marketingError) {
                if (window.languageSwitcher) {
                    const lang = window.languageSwitcher.currentLanguage;
                    marketingError.textContent =
                        window.languageSwitcher.translations[lang]["Please accept at least one privacy consent."] ||
                        "Please accept at least one privacy consent.";
                } else {
                    marketingError.textContent = "Please accept at least one privacy consent.";
                }
            }
            if (profilingError) {
                if (window.languageSwitcher) {
                    const lang = window.languageSwitcher.currentLanguage;
                    profilingError.textContent =
                        window.languageSwitcher.translations[lang]["Please accept at least one privacy consent."] ||
                        "Please accept at least one privacy consent.";
                } else {
                    profilingError.textContent = "Please accept at least one privacy consent.";
                }
            }
        } else {
            // Clear privacy consent errors if valid
            const marketingError = document.getElementById("marketingConsent-error");
            const profilingError = document.getElementById("profilingConsent-error");
            if (marketingError) marketingError.textContent = "";
            if (profilingError) profilingError.textContent = "";
        }

        if (!isValid) {
            if (status) {
                status.textContent = "";
                status.className = "form-status error";
                if (window.languageSwitcher) {
                    const lang = window.languageSwitcher.currentLanguage;
                    status.textContent =
                        window.languageSwitcher.translations[lang]["Please fill in all required fields."] ||
                        "Please fill in all required fields.";
                } else {
                    status.textContent = "Please fill in all required fields.";
                }
            }
            return;
        }

        // Prepare form data
        const formData = {
            first_name: firstName,
            last_name: lastName,
            residence: residence,
            email: email,
            phone: phone || "",
            models: selectedModels.join(", ") || "",
            port: port || "",
            boat_registration: boatRegistration || "",
            message: message || "",
            marketing_consent: marketingConsent,
            profiling_consent: profilingConsent,
        };

        // Log to console (temporary - will be replaced with API call)
        console.log("Form data to be sent:", formData);

        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        // Show sending status
        if (status) {
            status.textContent = "";
            status.className = "form-status";
            if (window.languageSwitcher) {
                const lang = window.languageSwitcher.currentLanguage;
                status.textContent = window.languageSwitcher.translations[lang]["Sending..."] || "Sending...";
            } else {
                status.textContent = "Sending...";
            }
        }

        // API endpoint для відправки форми
        //
        // ВАРІАНТ 1: AWS Lambda + API Gateway (для статичних сайтів) ⭐ РЕКОМЕНДОВАНО
        // Замініть на ваш API Gateway URL (див. SERVERLESS_SETUP.md):
        // const API_ENDPOINT = "https://xxxxx.execute-api.us-east-1.amazonaws.com/prod/send-email";
        //
        // ВАРІАНТ 2: Node.js/Express Backend (якщо є можливість запускати сервер)
        // Для локальної розробки: http://localhost:3000/api/send-email
        // Для продакшену: https://your-domain.com/api/send-email
        //
        const API_ENDPOINT = "https://ic3t88zejk.execute-api.eu-north-1.amazonaws.com/v2/send-email"; // ⚠️ ЗАМІНІТЬ НА ВАШ URL!

        try {
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success
                if (status) {
                    status.className = "form-status success";
                    if (window.languageSwitcher) {
                        const lang = window.languageSwitcher.currentLanguage;
                        status.textContent =
                            window.languageSwitcher.translations[lang]["Message sent successfully!"] ||
                            "Message sent successfully!";
                    } else {
                        status.textContent = "Message sent successfully!";
                    }
                }
                form.reset();
                selectedModels = [];
                badgeProducts.forEach((badge) => badge.classList.remove("chips-label-active"));
                if (selectedModelsInput) selectedModelsInput.value = "";
                if (placeholderText) {
                    if (window.languageSwitcher) {
                        const lang = window.languageSwitcher.currentLanguage;
                        placeholderText.textContent =
                            window.languageSwitcher.translations[lang]["Model of Interest"] || "Modello di interesse";
                    } else {
                        placeholderText.textContent = "Modello di interesse";
                    }
                }
                if (charCount) charCount.textContent = "0";
                checkRequiredFields();
                setTimeout(() => {
                    closeModal();
                    localStorage.setItem("contactShown", "true");
                }, 1500);
            } else {
                throw new Error(result.message || "Failed to send");
            }
        } catch (error) {
            console.error("Error sending form:", error);
            if (status) {
                status.className = "form-status error";
                if (window.languageSwitcher) {
                    const lang = window.languageSwitcher.currentLanguage;
                    status.textContent =
                        window.languageSwitcher.translations[lang]["Failed to send message. Try again."] ||
                        "Failed to send message. Try again.";
                } else {
                    status.textContent = "Failed to send message. Try again.";
                }
            }
            if (submitBtn) {
                submitBtn.disabled = false;
            }
        }
    });

    // Update form translations when language changes
    function updateFormTranslations() {
        if (!window.languageSwitcher) return;

        const lang = window.languageSwitcher.currentLanguage;
        const translations = window.languageSwitcher.translations[lang];

        // Update placeholders
        document.querySelectorAll("[data-translate-placeholder]").forEach((input) => {
            const key = input.getAttribute("data-translate-placeholder");
            if (translations[key]) {
                const placeholder = translations[key];
                if (input.hasAttribute("required")) {
                    input.placeholder = `${placeholder}*`;
                } else {
                    input.placeholder = placeholder;
                }
            }
        });

        // Update model dropdown placeholder
        if (placeholderText && selectedModels.length === 0) {
            const key = "Model of Interest";
            if (translations[key]) {
                placeholderText.textContent = translations[key];
            }
        }
    }

    // Listen for language changes
    if (window.languageSwitcher) {
        const originalTranslate = window.languageSwitcher.translateContent;
        window.languageSwitcher.translateContent = function (language) {
            originalTranslate.call(this, language);
            updateFormTranslations();
        };
    }

    // Initial translation update
    updateFormTranslations();
})();
