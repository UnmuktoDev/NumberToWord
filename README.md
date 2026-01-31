# Number To Word - Advanced Number Converter

An advanced, high-performance web tool designed to convert extremely large numbers into Bangla words and vice versa. It supports both the modern Bangla numbering system (Hajar, Lokkho, Koti) and the ancient Sanskrit-based mathematical system.

![Bangla Number Converter](https://img.shields.io/badge/Status-Active-emerald)
![JS](https://img.shields.io/badge/Vanilla-JS-yellow)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## 🚀 Key Features

- **Massive Number Support**: Uses JavaScript `BigInt` to process numbers far beyond the limits of standard calculators (quadrillions, quintillions, and more).
- **Three Conversion Modes**:
    1.  **Number to Word (Modern)**: Converts digits into the standard Bangla naming system (লক্ষ, কোটি).
    2.  **Word to Number (Reverse)**: Parses Bangla spelling back into digits with high accuracy.
    3.  **Sanskrit/Ancient System**: Converts numbers into rare traditional units like **Arbud (অর্বুদ)**, **Shankha (শঙ্খ)**, and **Parardha (পরার্ধ)**.
- **🔊 Integrated TTS (Text-to-Speech)**: Real-time high-quality Bangla Voice Output.
- **Reference Library**: Interactive grid for numbers 1 to 99 with individual audio pronunciations.
- **Mobile Responsive**: Fully optimized for smartphones, tablets, and desktops using Tailwind CSS.
- **Zero Dependencies**: Built with vanilla HTML, CSS, and JS for lightning-fast performance.

## 🛠️ Tech Stack

-   **Frontend**: HTML5, Tailwind CSS
-   **Logic**: Vanilla JavaScript (ES6+) with `BigInt`
-   **Typography**: [Hind Siliguri](https://fonts.google.com/specimen/Hind+Siliguri) (Google Fonts)

## 📖 Naming Systems Supported

### 1. Modern Bangla System
Uses the standard hierarchy:
- **Hajar (হাজার)**: $10^3$
- **Lokkho (লক্ষ)**: $10^5$
- **Koti (কোটি)**: $10^7$ (Scales recursively for larger numbers, e.g., "Koti Koti").

### 2. Traditional Sanskrit System
Supports specific powers of 10:
- **Ayut (অযুত)**: $10^4$
- **Niyut (নিযুত)**: $10^6$
- **Arbud (অর্বুদ)**: $10^8$
- **Mahapadma (মহাপদ্ম)**: $10^{12}$
- **Shankha (শঙ্খ)**: $10^{13}$
- **Parardha (পরার্ধ)**: $10^{17}$

## 💻 Installation & Usage

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/UnmuktoDev/NumberToWord.git
    ```
2.  **Open the project**:
    Simply open `index.html` in any modern web browser.
3.  **Data Customization**:
    All number spellings and units are managed in `data.json`. You can modify this file to update spellings or add new units.

## 📄 License
This project is open-source. Feel free to use and modify it for your own needs.

---
*Created with ❤️ for the Bangla language.*
