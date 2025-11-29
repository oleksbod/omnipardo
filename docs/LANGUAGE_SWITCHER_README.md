# Language Switcher Implementation

## Overview

This implementation adds a dynamic language switching system to the Pardo Yachts configurator website, allowing users to switch between Italian and English languages.

## Files Modified/Created

### 1. `js/language-switcher.js` (NEW)

-   Main language switching module
-   Contains translation mappings for all configuration steps and footer elements
-   Handles language persistence using localStorage
-   Provides dynamic content translation

### 2. `it-header-footer.html` (MODIFIED)

-   Added language switcher to footer
-   Added translation attributes to key elements
-   Included language switcher script
-   Default language: Italian

### 3. `index.html` (MODIFIED)

-   Updated language switcher in footer
-   Added translation attributes to configuration steps
-   Included language switcher script
-   Default language: English (with Italian content)

### 4. `test-language.html` (NEW)

-   Test page to verify language switching functionality
-   Contains sample translations for testing

## Translation Mappings

### Configuration Steps

| Italian (Original)           | Italian (New)                | English                       |
| ---------------------------- | ---------------------------- | ----------------------------- |
| Scegli il Modello Esterno    | Scegli il Modello            | Choose model                  |
| Colori dell'esterno          | Colori delle vernici esterne | Exterior paint colors         |
| Carena                       | Carena                       | Hull color                    |
| Linea di Bellezza            | Linea di galleggiamento      | Waterline stripe              |
| Scafo                        | Scafo                        | Hull shell                    |
| Coperta                      | Coperta                      | Deck                          |
| T-Top                        | T-Top                        | T-Top                         |
| Cockpit                      | Cockpit                      | Cockpit                       |
| Cucina                       | Cucina                       | Galley / Kitchen              |
| Ante cucina                  | Ante cucina                  | Galley doors                  |
| Pavimentazione               | Pavimentazione               | Flooring                      |
| Sedute zona timoneria        | Sedute zona timoneria        | Helm area seats               |
| Tessuto interno sedute guida | Tessuto interno sedute guida | Helm Seat Interior Upholstery |
| Tessuto esterno sedute guida | Tessuto esterno sedute guida | Helm Seat Exterior Upholstery |
| Altri sedili esterni         | Divaneria                    | Upholstery                    |
| Scegli il Modello Interno    | Interno                      | Interiors                     |
| Essenza:                     | Essenza                      | Wood finish                   |
| Tessuti divani               | Tessuti divani               | Sofa fabrics                  |
| Moquette                     | Moquette                     | Carpet                        |

### Footer Elements

-   Stay updated / Rimani aggiornato
-   Pardo's range / La gamma Pardo
-   You discover Walkaround / Scopri Walkaround
-   You discover Endurance / Scopri Endurance
-   You discover GT / Scopri GT
-   And many more footer navigation elements

## How It Works

1. **Language Detection**: The system checks localStorage for a saved language preference
2. **Default Language**:
    - `it-header-footer.html`: Italian (it)
    - `index.html`: English (en) with Italian content
3. **Dynamic Translation**: When language is switched, all elements with `data-translate` attributes are updated
4. **Persistence**: Language choice is saved in localStorage for future visits
5. **Visual Feedback**: Flag icons change to reflect current language

## Usage

### For Users

1. Click the language switcher in the footer
2. The page content will dynamically switch between Italian and English
3. Language preference is automatically saved

### For Developers

1. Add `data-translate="key"` attribute to any element that needs translation
2. Add the translation key-value pair to the `translations` object in `language-switcher.js`
3. The system will automatically handle the translation

## Testing

1. Open `test-language.html` in a browser
2. Click the language switcher to test functionality
3. Verify that:
    - Text changes between languages
    - Flag icons update correctly
    - Language preference persists on page reload

## Browser Compatibility

-   Modern browsers with ES6 support
-   localStorage support required
-   TreeWalker API support required

## Future Enhancements

1. Add more languages (French, German, Spanish)
2. Implement server-side language detection
3. Add RTL language support
4. Implement lazy loading for translation files
5. Add language-specific URL routing
