# TDEI Brand Guidelines & Style Guide

A reference guide for colors, fonts, and UI components used in TDEI projects.

---

## 1. Core Principles

- **No hardcoded colors**: Always reference defined CSS variables (like `var(--brand-primary)` and `var(--secondary-color)`) instead of writing raw hex codes in component files.
- **Avoid inline styling**: Use CSS Modules or predefined utility classes instead of React `style={{ ... }}` attributes.
- **Follow WCAG accessibility standards**:
  - Maintain WCAG AA contrast ratios (minimum 4.5:1 for normal text).
  - Ensure all interactive elements have visible keyboard focus outlines (`--color-focus-ring`).
  - Provide descriptive `alt` tags on all images and proper labels on form controls.
- **Use solid flat colors (No gradients)**: Stick to flat, solid brand colors across all pages and components.
- **Use SVG icons (No emojis)**: Use vector SVG icons for UI actions and indicators. Do not use emojis in UI controls or headings.
- **Consistent typography hierarchy**: Use `Montserrat` for page titles and section headers, and `Open Sans` for body text, form controls, and tables.
- **Semantic HTML & clear states**: Use semantic HTML tags (`<button>`, `<nav>`, `<header>`) and provide clear hover, active, focus, and disabled states for all interactive elements.

---

## 2. Colors

### 2.1 Main Brand & Accent Colors

| Color | CSS Variable | HEX | RGB | Where to use |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Primary** | `--brand-primary` / `--primary-color` | `#32006e` | `rgb(50, 0, 110)` | Top headers, primary buttons, and active states |
| **Brand Accent** | `--brand-accent` | `#4b2e83` | `rgb(75, 46, 131)` | Hover states, focused borders, and title accents |
| **Accent Blue** | `--tdei-blue` | `#586ab5` | `rgb(88, 106, 181)` | Left card borders, category tags, and info highlights |
| **Accent Teal** | `--tdei-green` | `#479fa1` | `rgb(71, 159, 161)` | Positive metrics, success tags, and charts |
| **Accent Cyan** | `--tdei-cyan` | `#59c3c8` | `rgb(89, 195, 200)` | Outline buttons (`.tdei-button2`) and secondary highlights |
| **Accent Maroon** | `--tdei-maroon` | `#c84349` | `rgb(200, 67, 73)` | Danger pill buttons (`.maroon-bg`) and delete actions |

### 2.2 Purple Surface Colors

| Name | CSS Variable | HEX | Where to use |
| :--- | :--- | :--- | :--- |
| **Light Purple** | `--purple-background-light` | `#f4f0fb` | Card backgrounds and highlighted table rows |
| **Medium Purple** | `--purple-background-medium` | `#ebe4f6` | Badge backgrounds and selection chips |
| **Dark Purple** | `--purple-background-dark` | `#ddd2ee` | Subtle borders and divider lines |
| **Soft Purple Border** | `--purple-border-soft` | `#d8d1e9` | Modal borders and card headers |

### 2.3 Neutrals & Text Colors

| Name | CSS Variable | HEX | Where to use |
| :--- | :--- | :--- | :--- |
| **Navy Text** | `--navy-text` | `#162848` | Main page titles and table headers |
| **Charcoal Text** | `--charcoal-text` | `#111827` | Section headings and modal titles |
| **Body Text** | `--body-text` | `#374151` | General paragraphs, reports, and form fields |
| **Secondary Grey** | `--secondary-color` | `#5f647a` | Subtitles, labels, hints, and placeholder text |
| **Input Border** | `--border-color` | `#dee2e6` | Standard inputs and light table dividers |
| **Card Border** | `--card-border` | `#eeeeee` | Outlines for cards and container panels |
| **Surface Background** | `--bg-light` | `#f8f8f8` | Off-white background for app surfaces |
| **Pure White** | `--white` | `#ffffff` | Background for cards, dialogs, and inputs |

### 2.4 Status Colors

| State | HEX | Background Tint | Where to use |
| :--- | :--- | :--- | :--- |
| **Success** | `#008000` | `#e6f4ea` | Completed actions and success checkmarks |
| **Warning** | `#c65d03` | `#fef7e0` | Alerts, in-progress items, and notices |
| **Danger / Error** | `#dc3545` | `#fce8e6` | Errors, failed actions, and required indicators |
| **Focus Ring** | `#2684ff` | — | Keyboard focus ring for accessibility |

---

## 3. Typography & Fonts

### 3.1 Font Families

- **Primary font**: `"Open Sans", sans-serif`
  - Weights: `300` (Light), `400` (Regular), `500` (Medium), `600` (Semi-bold), `700` (Bold)
  - Used for body copy, inputs, buttons, tables, and descriptions.
- **Secondary font**: `"Montserrat", sans-serif`
  - Weights: `300` (Light), `400` (Regular), `500` (Medium), `600` (Semi-bold), `700` (Bold)
  - Used for page titles, headings, and modal titles.
- **Monospace font**: `"JetBrains Mono", monospace`
  - Used for IDs, tokens, and code snippets.

### 3.2 Text Sizes & Classes

| Class Name | Font | Size | Weight | Where to use |
| :--- | :--- | :--- | :--- | :--- |
| `.page-header-title` | Montserrat | `24px` | `700` (Bold) | Top page title |
| `.formTitle` | Montserrat | `26px` | `300` (Light) | Form title |
| `.section-title` | Montserrat | `20px` | `700` (Bold) | Main section header |
| `.sub-section-title` | Montserrat | `16px` | `700` (Bold) | Sub-section header |
| `.page-header-subtitle` | Montserrat | `14px` | `400` (Regular) | Page subtitle |
| `.tdei-bold-name` | Open Sans | `16px` | `700` (Bold) | Item name or title |
| `.tdei-name-desc` | Open Sans | `14px` | `400` (Regular) | Item description |
| `.tdei-hint-text` | Open Sans | `14px` | `400` (Italic) | Helper text below input |
| `.apiKey` / Code | JetBrains Mono | `13px` | `400` (Regular) | Token or ID display |

---

## 4. UI Components

### 4.1 Buttons

```css
/* Primary button for main actions */
.tdei-primary-button {
  background-color: var(--brand-primary);
  border: 1px solid var(--brand-primary);
  color: #ffffff;
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.tdei-primary-button:hover {
  background-color: var(--brand-accent);
  border-color: var(--brand-accent);
}

/* Secondary button for neutral actions */
.tdei-secondary-button {
  background: transparent;
  border: 1px solid var(--secondary-color);
  color: var(--secondary-color);
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.tdei-secondary-button:hover {
  background-color: var(--secondary-color);
  color: #ffffff;
}

/* Pill button for quick actions */
.tdei-rounded-button {
  background-color: var(--brand-primary);
  border: 1px solid var(--brand-primary);
  color: #ffffff;
  font-weight: 600;
  border-radius: 100px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.tdei-rounded-button:hover {
  background-color: var(--brand-accent);
  border-color: var(--brand-accent);
}

/* Outline button with cyan border */
.tdei-button2 {
  background: transparent;
  border: 2px solid #59c3c8;
  color: #59c3c8;
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
}
.tdei-button2:hover {
  background-color: #59c3c8;
  color: #ffffff;
}

/* Danger pill button for destructive actions */
.maroon-bg {
  background-color: #c84349;
  border: 1px solid #c84349;
  color: #ffffff;
  font-weight: 600;
  border-radius: 100px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
}
.maroon-bg:hover {
  background-color: #b0383e;
  border-color: #b0383e;
}
```

### 4.2 Status Chips & Badges

```css
/* Base chip style */
.badge-status {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Completed or success state */
.badge-completed {
  background-color: #e6f4ea;
  color: #008000;
  border: 1px solid #ceead6;
}

/* In progress or info state */
.badge-in-progress {
  background-color: #e8f0fe;
  color: #0969da;
  border: 1px solid #c7d2fe;
}

/* Failed or error state */
.badge-failed {
  background-color: #fce8e6;
  color: #dc3545;
  border: 1px solid #fad2cf;
}

/* Archived or inactive state */
.badge-abandoned {
  background-color: #f1f3f4;
  color: #5f647a;
  border: 1px solid #dadce0;
}

/* Primary category tag */
.badge-type-primary {
  background-color: #eef2ff;
  color: #586ab5;
  border: 1px solid #c7d2fe;
  font-weight: 700;
}
```

---

## 5. CSS Custom Properties (:root)

You can copy and paste these CSS variables directly into your project's stylesheet:

```css
:root {
  /* Fonts */
  --primary-font-family: "Open Sans", sans-serif;
  --secondary-font-family: "Montserrat", sans-serif;
  --code-font-family: "JetBrains Mono", monospace;

  /* Brand Colors */
  --brand-primary: #32006e;
  --brand-accent: #4b2e83;
  --primary-color: var(--brand-primary);
  --primary-color-dark: var(--brand-primary);

  /* Accents */
  --tdei-blue: #586ab5;
  --tdei-green: #479fa1;
  --tdei-cyan: #59c3c8;
  --tdei-maroon: #c84349;

  /* Purple Surfaces */
  --purple-background-light: #f4f0fb;
  --purple-background-medium: #ebe4f6;
  --purple-background-dark: #ddd2ee;
  --purple-border-soft: #d8d1e9;

  /* Neutrals & Text */
  --navy-text: #162848;
  --charcoal-text: #111827;
  --body-text: #374151;
  --secondary-color: #5f647a;
  --border-color: #dee2e6;
  --card-border: #eeeeee;
  --bg-light: #f8f8f8;
  --white: #ffffff;

  /* Status Colors */
  --color-success: #008000;
  --color-warning: #c65d03;
  --color-danger: #dc3545;
  --color-focus-ring: #2684ff;
}
```