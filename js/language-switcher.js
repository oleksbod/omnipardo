// Language Switcher Module
class LanguageSwitcher {
    constructor() {
        // Detect current language from HTML or localStorage
        this.currentLanguage = this.detectCurrentLanguage();
        this.translations = {
            it: {
                // Configuration Steps
                "tech-description": "Dati tecnici ed equipaggiamento di serie",
                "Scegli il Modello Esterno": "Scegli il Modello",
                "Colori dell'esterno": "Colori delle vernici esterne",
                Carena: "Carena",
                "Linea di Bellezza": "Linea di galleggiamento",
                Scafo: "Scafo",
                Coperta: "Coperta",
                "T-Top": "T-Top",
                Cockpit: "Cockpit",
                Cucina: "Cucina",
                "Ante cucina": "Ante cucina",
                Pavimentazione: "Pavimentazione",
                "Sedute zona timoneria": "Sedute zona timoneria",
                "Tessuto interno sedute guida": "Tessuto interno sedute guida",
                "Tessuto esterno sedute guida": "Tessuto esterno sedute guida",
                "Altri sedili esterni": "Divaneria",
                "Scegli il Modello Interno": "Interno",
                "Essenza:": "Essenza",
                "Tessuti divani": "Tessuti divani",
                Moquette: "Moquette",

                // Form translations
                "Chiedi a noi, saremo lieti di assisterti": "Chiedi a noi, saremo lieti di assisterti",
                "Required fields": "Campi obbligatori",
                Name: "Nome*",
                Surname: "Cognome*",
                "Place of Residence": "Luogo di residenza*",
                Email: "Email*",
                Phone: "Telefono*",
                "Model of Interest": "Modello di interesse",
                "Navigation Area": "Area di navigazione",
                "Boat Owned, if present": "Barca posseduta, se presente",
                Message: "Messaggio",
                Send: "Invia",
                "Sending...": "Invio in corso...",
                "Message sent successfully!": "Messaggio inviato con successo!",
                "Failed to send message. Try again.": "Invio fallito. Riprova.",
                "Please fill in all required fields.": "Compila tutti i campi obbligatori.",
                "Please enter a valid email address.": "Inserisci un indirizzo email valido.",
                "Please accept at least one privacy consent.": "Accetta almeno un consenso alla privacy.",
                "Marketing consent text":
                    "Prestando il tuo consenso, potremo inviarti comunicazioni commerciali relative a Pardo Yachts via e-mail, telefono, e potremo effettuarericerche di mercato al fine di valutare il tuo livello di soddisfazione riguardo i nostri prodotti e servizi.",
                "Profiling consent text":
                    "Prestando il tuo consenso, potremo inviarti comunicazioni commerciali personalizzate in base alle tue abitudini di acquisto e, in generale, inbase ai tuoi interessi, alle tue richieste e alle tue interazioni con noi.",

                // Footer translations
                "Stay updated": "Rimani aggiornato",
                "Get the most relevant news from the Pardo world.": "Ricevi le notizie più rilevanti dal mondo Pardo.",
                "Privacy Policy": "Privacy Policy",
                Visitor: "Visitatore",
                "Owner Pardo": "Proprietario Pardo",
                "E-mail": "Email",
                About: "About",
                "Events & News": "Events & News",
                Partnerships: "Partnerships",
                Contacts: "Contatti",
                "Work with us": "Lavora con noi",
                "Find a Dealer": "Trova un Dealer",
                "After Sales": "After Sales",
                Privacy: "Privacy",
                Cookie: "Cookie",
                "Pardo's range": "Pardo's range",
                Walkaround: "Walkaround",
                "walkaround-description":
                    "Il piano unico di coperta walkaround è un invito a godere al meglio degli ampi spazi dedicati al relax, al contatto con il mare e alla socializzazione a bordo, agevolando una circolazione fluida e sicura tra tutte le aree della barca. Questa caratteristica amplifica lo spirito libero degli open in gamma – P38, P43, P50 e il nuovo P75 in arrivo – yacht performanti e divertenti da condurre e da vivere, progettati per combinare velocità, comfort e stabilità, assicurando un’esperienza di navigazione ottimale grazie all’estrema facilità di manovra.",
                "endurance-description":
                    "Gli yacht della gamma Endurance sono progettati per chi ama le lunghe crociere e una navigazione rilassata e silenziosa. I modelli E60 e E72 consentono infatti piacevoli trasferimenti, anche notturni, potendo disporre di grandi autonomie a velocità controllate e consumi ridotti ed efficienti. Gli ampi spazi a disposizione, dalle cabine al flybridge, sono valorizzati da un design contemporaneo e sempre funzionale, per offrire una vivibilità e una permanenza a bordo in armonia con le più sofisticate soluzioni di comfort abitativo. Anche all’interno, questi yacht sono concepiti per far sentire l’ambiente marino, creando un continuum con l’esterno attraverso l’apertura delle grandi vetrate panoramiche.",
                "gt-description":
                    "Il perfetto equilibrio tra sportività, comfort abitativo e forte identità estetica caratterizza la gamma GT, che unisce lo spirito dinamico del walkaround agli ampi volumi tipici di un endurance . Le superfici disponibili a bordo dei modelli – GT52, GT75 e GT65 (in sviluppo) – sono razionalizzate da un design distintivo e funzionale, per offrire agli ospiti ambienti accoglienti in cui rigenerarsi, mantenendo sempre una continuità visiva e fisica con l’esterno, grazie a vetrate panoramiche e grandi finestrature apribili. Uno yacht GT consente così di alternare momenti di appagante convivialità, o di raccoglimento, al piacere di una navigazione potente e sportiva.",
                Endurance: "Endurance",
                GT: "GT",
                "Ask Pardo": "Chiedi a Pardo",
                "You discover Walkaround": "Scopri Walkaround",
                "You discover Endurance": "Scopri Endurance",
                "You discover GT": "Scopri GT",
                "Newsletter subscription": "Iscrizione alla newsletter",
                "Check your email to confirm your subscription to the newsletter.":
                    "Controlla la tua email per confermare l'iscrizione alla newsletter.",
                LANGUAGE: "LINGUA",
                "Cambia lingua": "Cambia lingua",
                Inglese: "Inglese",
                Italiano: "Italiano",
                "Conferma selezione": "Conferma selezione",
                "Seleziona una lingua prima di confermare.": "Seleziona una lingua prima di confermare.",
                // Header translations
                About: "About",
                "Events & News": "Events & News",
                "Find a Dealer": "Trova un Dealer",
                "After Sales": "After Sales",
                Contacts: "Contatti",
                "Work with us": "Lavora con noi",
                Partnerships: "Partnership",
                Privacy: "Privacy",
                Cookie: "Cookie",
                "View all models": "Tutti i modelli",
                "You discover Walkaround": "Scopri Walkaround",
                "You discover Endurance": "Scopri Endurance",
                "You discover GT": "Scopri GT",
                "Ask Pardo": "Chiedi a Pardo",
                Visitor: "Visitatore",
                "Owner Pardo": "Proprietario Pardo",
                "OVERALL LENGTH": "LUNGHEZZA",
                "MAX BEAM": "LARGHEZZA",
                DISPLACEMENT: "DISLOCAMENTO",
                SOON: "SOON",
                "Select a dealer": "Seleziona un dealer",
                "Email me my configuration": "Inviami la mia configurazione via email",
            },
            en: {
                // Configuration Steps
                "tech-description": "Technical data and standard equipment",
                "Scegli il Modello Esterno": "Choose model",
                "Colori dell'esterno": "Exterior paint colors",
                Carena: "Hull color",
                "Linea di Bellezza": "Waterline stripe",
                Scafo: "Hull shell",
                Coperta: "Deck",
                "T-Top": "T-Top",
                Cockpit: "Cockpit",
                Cucina: "Galley / Kitchen",
                "Ante cucina": "Galley doors",
                Pavimentazione: "Flooring",
                "Sedute zona timoneria": "Helm area seats",
                "Tessuto interno sedute guida": "Helm Seat Interior Upholstery",
                "Tessuto esterno sedute guida": "Helm Seat Exterior Upholstery",
                "Altri sedili esterni": "Upholstery",
                "Scegli il Modello Interno": "Interiors",
                "Essenza:": "Wood finish",
                "Tessuti divani": "Sofa fabrics",
                Moquette: "Carpet",

                // Form translations
                "Chiedi a noi, saremo lieti di assisterti": "Ask us, we will be happy to assist you",
                "Required fields": "Required fields",
                Name: "Name*",
                Surname: "Surname*",
                "Place of Residence": "Place of Residence*",
                Email: "Email*",
                Phone: "Phone*",
                "Model of Interest": "Model of Interest",
                "Navigation Area": "Navigation Area",
                "Boat Owned, if present": "Boat Owned, if present",
                Message: "Message",
                Send: "Send",
                "Sending...": "Sending...",
                "Message sent successfully!": "Message sent successfully!",
                "Failed to send message. Try again.": "Failed to send message. Try again.",
                "Please fill in all required fields.": "Please fill in all required fields.",
                "Please enter a valid email address.": "Please enter a valid email address.",
                "Please accept at least one privacy consent.": "Please accept at least one privacy consent.",
                "Marketing consent text":
                    "By checking this box you consent to receive commercial communications and participate in market research regarding Pardo Yachts products and services via email, phone, and traditional mail.",
                "Profiling consent text":
                    "By checking this box, we will send you personalized commercial communications based on your purchasing habits and, in general, based on your interests, requests and interactions with us.",

                // Footer translations
                "Stay updated": "Stay updated",
                "Get the most relevant news from the Pardo world.": "Get the most relevant news from the Pardo world.",
                "Privacy Policy": "Privacy Policy",
                Visitor: "Visitor",
                "Owner Pardo": "Owner Pardo",
                "E-mail": "E-mail",
                About: "About",
                "Events & News": "Events & News",
                Partnerships: "Partnerships",
                Contacts: "Contacts",
                "Work with us": "Work with us",
                "Find a Dealer": "Find a Dealer",
                "After Sales": "After Sales",
                Privacy: "Privacy",
                Cookie: "Cookie",
                "Pardo's range": "Pardo's range",
                Walkaround: "Walkaround",
                Endurance: "Endurance",
                GT: "GT",
                "walkaround-description":
                    "The single level walkaround deck is an invitation to fully enjoy the generous spaces dedicated to relaxation, connection with the sea, and socializing on board. It ensures smooth and safe movement between all areas of the yacht. This feature enhances the free-spirited nature of the open range – the P38, P43, P50, and the upcoming P75 – yachts that are as enjoyable to handle as they are to live aboard. Designed to combine speed, comfort, and stability, they guarantee an optimal sailing experience thanks to their exceptional ease of maneuvering.",
                "endurance-description":
                    "The yachts in the Endurance range are designed for lovers of long cruises and seek a relaxed, quiet sailing experience. The E60 and E72 models allow for enjoyable journeys, including overnight passages, offering impressive range at controlled speeds with reduced and efficient fuel consumption. The generous spaces, from the cabins to the flybridge, are enhanced by a contemporary and always functional design, providing livability and comfort in harmony with the most sophisticated residential solutions. Even the interiors are crafted to fully immerse yourself in the marine setting, creating a seamless connection with the outdoors through the opening of large panoramic windows.",
                "gt-description":
                    "The perfect balance of sportiness, onboard comfort, and strong aesthetic identity defines the GT range, which combines the dynamic spirit of the walkaround with the generous volumes typical of an Endurance yacht. The spaces on board the GT52, GT75, and the upcoming GT65 are optimized with a distinctive and functional design, offering guests welcoming environments to unwind while maintaining a constant visual and physical connection with the outdoors, thanks to panoramic glazing and large, opening windows. A GT yacht allows you to alternate between moments of rewarding conviviality or quiet retreat and the thrill of powerful, sporty cruising.",

                "Ask Pardo": "Ask Pardo",
                "You discover Walkaround": "You discover Walkaround",
                "You discover Endurance": "You discover Endurance",
                "You discover GT": "You discover GT",
                "Newsletter subscription": "Newsletter subscription",
                "Check your email to confirm your subscription to the newsletter.":
                    "Check your email to confirm your subscription to the newsletter.",
                LANGUAGE: "LANGUAGE",
                "Cambia lingua": "Change language",
                Inglese: "English",
                Italiano: "Italian",
                "Conferma selezione": "Confirm selection",
                "Seleziona una lingua prima di confermare.": "Please select a language before confirming.",
                About: "About",
                "Events & News": "Events & News",
                "Find a Dealer": "Find a Dealer",
                "After Sales": "After Sales",
                Contacts: "Contacts",
                "Work with us": "Work with us",
                Partnerships: "Partnerships",
                Privacy: "Privacy",
                Cookie: "Cookie",
                "View all models": "View all models",
                "You discover Walkaround": "You discover Walkaround",
                "You discover Endurance": "You discover Endurance",
                "You discover GT": "You discover GT",
                "Ask Pardo": "Ask Pardo",
                Visitor: "Visitor",
                "Owner Pardo": "Owner Pardo",
                "OVERALL LENGTH": "OVERALL LENGTH",
                "MAX BEAM": "MAX BEAM",
                DISPLACEMENT: "DISPLACEMENT",
                SOON: "SOON",
                "Select a dealer": "Select a dealer",
                "Email me my configuration": "Email me my configuration",
            },
        };

        this.init();
    }

    init() {
        this.createLanguageSwitcher();
        this.applyLanguage(this.currentLanguage);
        this.bindEvents();

        // Log the initial state
        console.log(`Language switcher initialized with: ${this.currentLanguage}`);
    }

    detectCurrentLanguage() {
        // First check localStorage for user's previous choice
        const storedLanguage = this.getStoredLanguage();
        if (storedLanguage) {
            console.log(`Using user's stored language choice: ${storedLanguage}`);
            return storedLanguage;
        }

        // If no stored language, default to Italian
        console.log("No stored language found, defaulting to Italian");
        return "it";
    }

    getStoredLanguage() {
        return localStorage.getItem("selectedLanguage");
    }

    setStoredLanguage(language) {
        localStorage.setItem("selectedLanguage", language);
        console.log(`Language preference saved: ${language}`);
    }

    // Method to clear stored language (for testing)
    clearStoredLanguage() {
        localStorage.removeItem("selectedLanguage");
        console.log("Stored language preference cleared");
    }

    createLanguageSwitcher() {
        // Check if switcher already exists
        if (document.querySelector(".language-switcher")) {
            return;
        }

        const footer = document.querySelector("footer");
        if (!footer) return;

        // Find the language selector container or create one
        let languageContainer = footer.querySelector(".language-selector-container");
        if (!languageContainer) {
            languageContainer = document.createElement("div");
            languageContainer.className =
                "language-selector-container w-full h-auto flex flex-col items-start justify-center py-6";
            languageContainer.style.display = "block";

            // Insert before the gamma-container
            const gammaContainer = footer.querySelector(".gamma-container");
            if (gammaContainer) {
                gammaContainer.parentNode.insertBefore(languageContainer, gammaContainer);
            } else {
                footer.appendChild(languageContainer);
            }
        }

        languageContainer.innerHTML = `
            <div class="w-[155px] h-auto bg-white flex flex-row items-center justify-between rounded-lg gap-x-3 px-4 py-1 cursor-pointer language-switcher" 
                 aria-label="Seleziona lingua" data-locale-code="${this.currentLanguage}">
                <p class="body-16 tt-norms-pro-med lg:text-[18px] lg:leading-[24px]">LANGUAGE</p>
                
                <!-- Language Icon -->
                <div class="w-auto h-auto" id="gb-icon" data-locale-code="en" style="display: ${
                    this.currentLanguage === "en" ? "block" : "none"
                }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none">
                        <g clip-path="url(#clip0_1177_20637)">
                            <path d="M0 0.5H20V15.5H0V0.5Z" fill="#012169"></path>
                            <path d="M2.34375 0.5L9.96875 6.15625L17.5625 0.5H20V2.4375L12.5 8.03125L20 13.5938V15.5H17.5L10 9.90625L2.53125 15.5H0V13.625L7.46875 8.0625L0 2.5V0.5H2.34375Z" fill="white"></path>
                            <path d="M13.25 9.28125L20 14.25V15.5L11.5312 9.28125H13.25ZM7.5 9.90625L7.6875 11L1.6875 15.5H0L7.5 9.90625ZM20 0.5V0.59375L12.2188 6.46875L12.2812 5.09375L18.4375 0.5H20ZM0 0.5L7.46875 6H5.59375L0 1.8125V0.5Z" fill="#C8102E"></path>
                            <path d="M7.53125 0.5V15.5H12.5312V0.5H7.53125ZM0 5.5V10.5H20V5.5H0Z" fill="white"></path>
                            <path d="M0 6.53125V9.53125H20V6.53125H0ZM8.53125 0.5V15.5H11.5312V0.5H8.53125Z" fill="#C8102E"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_1177_20637">
                                <rect width="20" height="15" fill="white" transform="translate(0 0.5)"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                <div class="w-auto h-auto" id="it-icon" data-locale-code="it" style="display: ${
                    this.currentLanguage === "it" ? "block" : "none"
                }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 81 61" fill="none">
                        <g clip-path="url(#clip0_1772_14487)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.256348 0.387695H80.2563V60.3877H0.256348V0.387695Z" fill="white"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.256348 0.387695H26.9188V60.3877H0.256348V0.387695Z" fill="#009246"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M53.5938 0.387695H80.2562V60.3877H53.5938V0.387695Z" fill="#CE2B37"></path>
                        </g>
                        <defs>
                            <clipPath id="clip0_1772_14487">
                                <rect width="80" height="60" fill="white" transform="translate(0.256348 0.387695)"></rect>
                            </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const switcher = document.querySelector(".language-switcher");
        if (switcher) {
            switcher.addEventListener("click", () => {
                this.toggleLanguage();
            });
        }
    }

    toggleLanguage() {
        const previousLanguage = this.currentLanguage;
        this.currentLanguage = this.currentLanguage === "it" ? "en" : "it";
        console.log(`Language switching from ${previousLanguage} to ${this.currentLanguage}`);
        this.setStoredLanguage(this.currentLanguage);
        this.applyLanguage(this.currentLanguage);
    }

    applyLanguage(language) {
        this.currentLanguage = language;

        // Update language switcher
        const switcher = document.querySelector(".language-switcher");
        if (switcher) {
            switcher.setAttribute("data-locale-code", language);
        }

        // Update flag icons
        const gbIcon = document.getElementById("gb-icon");
        const itIcon = document.getElementById("it-icon");
        if (gbIcon && itIcon) {
            gbIcon.style.display = language === "en" ? "block" : "none";
            itIcon.style.display = language === "it" ? "block" : "none";
        }

        // Apply translations
        this.translateContent(language);
    }

    translateContent(language) {
        const translations = this.translations[language];
        if (!translations) return;

        // Translate all elements with data-translate attribute
        document.querySelectorAll("[data-translate]").forEach((element) => {
            const key = element.getAttribute("data-translate");
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        // Translate specific elements by text content
        Object.keys(translations).forEach((key) => {
            // Find elements that contain the exact text
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

            const textNodes = [];
            let node;
            while ((node = walker.nextNode())) {
                if (node.textContent.trim() === key) {
                    textNodes.push(node);
                }
            }

            textNodes.forEach((textNode) => {
                textNode.textContent = translations[key];
            });
        });

        // Update placeholder text
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput && translations["E-mail"]) {
            emailInput.placeholder = translations["E-mail"];
        }

        // Update all elements with data-translate-placeholder attribute
        document.querySelectorAll("[data-translate-placeholder]").forEach((element) => {
            const key = element.getAttribute("data-translate-placeholder");
            if (translations[key]) {
                element.placeholder = translations[key];
            }
        });

        // Update aria-label attributes
        const languageSwitcher = document.querySelector(".language-switcher");
        if (languageSwitcher) {
            if (language === "it") {
                languageSwitcher.setAttribute("aria-label", "Seleziona lingua");
            } else {
                languageSwitcher.setAttribute("aria-label", "Select language");
            }
        }
    }

    // Method to add translation keys to elements
    addTranslationKey(element, key) {
        element.setAttribute("data-translate", key);
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    window.languageSwitcher = new LanguageSwitcher();

    // Make clearStoredLanguage available globally for testing
    window.clearLanguagePreference = function () {
        window.languageSwitcher.clearStoredLanguage();
        location.reload(); // Reload to test default behavior
    };
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
    module.exports = LanguageSwitcher;
}
