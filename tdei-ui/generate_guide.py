import os
import json
import base64
import re

# Load assets
with open('scratch_svg_data.json', 'r', encoding='utf-8') as f:
    assets_data = json.load(f)

# Categorize assets
categories = {
    "Navigation & Brand": [
        "tdei_logo.svg", "tdei-logo.png", "tdei-temp-logo.png", "icon-dashboard.svg", "dashboard-icon.svg",
        "icon-project-group.svg", "icon-prj-grp.svg", "icon-projectgroupIcon.svg", "icon-projectgroupIcon-old.svg", "project-group-icon.svg",
        "icon-services.svg", "icon-service-new.svg", "icon-service-old.svg", "services-icon.svg", "services-icon-menu.svg",
        "stations-icon.svg", "icon-datasets.svg", "datasetIcon.svg", "dataset-icon-menu.svg", "dataset-menu-item.svg",
        "dataset-row.svg", "dataset-row-old.svg", "icon-jobs.svg", "icon_jobs.svg", "icon-members.svg",
        "members-icon.svg", "icon-reports.svg", "stats.png", "feedback.svg", "icon-feedback.svg"
    ],
    "Actions & Controls": [
        "icon-edit.svg", "edit-img.svg", "icon-delete.svg", "trash-icon.svg", "icon-download.svg",
        "download-img.svg", "upload-icon.svg", "copy-icon.svg", "icon-copy-id.svg", "clipboard-copied.svg",
        "clone-img.svg", "clone-file-img.svg", "icon-refresh.svg", "refreshBtn.svg", "filter.svg",
        "sort.svg", "menu-options.svg", "menu-vertical.png", "logout.svg", "new-window-icon.svg",
        "action-open-console.svg", "action-deactivate.svg", "action-release.svg", "reset_pass.svg", "close-icon.svg"
    ],
    "Data Formats & Services": [
        "oswType.svg", "pathwayType.svg", "flexType.svg", "data_file.svg", "released-data-sets.svg",
        "service_upload.svg", "icon-job-dataset.svg", "icon-job-file.svg"
    ],
    "Status & Feedback Metrics": [
        "success-icon.svg", "checkIcon-purple.svg", "icon-warning.svg", "icon-noData.svg",
        "dataset-delete-confirmation.svg", "dataset-publish-confirmation.svg", "notSelectedIcon.png", "information.png",
        "icon-total-feedback.svg", "icon-overdue.svg", "icon-turnaroundtime.svg", "icon-open-issues.svg"
    ],
    "Users & Roles": [
        "user.svg", "user.png", "icon-feather-user.svg", "icon-userIcon.svg", "icon-userAvatar.png",
        "account-icon.png", "icon-add-poc.svg", "sitemap-solid.svg"
    ],
    "Arrows & System Tools": [
        "icon-down-arrow.svg", "icon-up-arrow.svg", "icon-switch-project.svg", "icon-mobile-menu.svg",
        "layout.svg", "data-viewer-icon.svg", "data-viewer-icon-disabled.svg", "icon-data-viewer.svg", "icon-data-viewer-off.svg"
    ]
}

# Color palettes
brand_colors = [
    {
        "name": "Brand Primary",
        "var": "--brand-primary",
        "alias": "--primary-color, --primary-color-dark",
        "hex": "#32006e",
        "rgb": "rgb(50, 0, 110)",
        "hsl": "hsl(267, 100%, 22%)",
        "category": "Brand",
        "desc": "Core TDEI deep purple used for main branding, primary buttons, headers, active navigation borders, and key interactive highlights.",
        "text_color": "#ffffff",
        "tags": ["primary", "brand", "button", "header", "active", "purple"]
    },
    {
        "name": "Brand Accent",
        "var": "--brand-accent",
        "alias": "",
        "hex": "#4b2e83",
        "rgb": "rgb(75, 46, 131)",
        "hsl": "hsl(261, 48%, 35%)",
        "category": "Brand",
        "desc": "UW accent purple used for secondary brand highlights, hover states, and emphasized titles.",
        "text_color": "#ffffff",
        "tags": ["accent", "brand", "purple", "uw"]
    },
    {
        "name": "TDEI Blue",
        "var": "--tdei-blue",
        "alias": "",
        "hex": "#586ab5",
        "rgb": "rgb(88, 106, 181)",
        "hsl": "hsl(228, 38%, 53%)",
        "category": "Brand Accent",
        "desc": "TDEI blue accent used for service container left borders, OSW tags, and secondary brand visual anchors.",
        "text_color": "#ffffff",
        "tags": ["blue", "osw", "border", "service", "accent"]
    },
    {
        "name": "TDEI Green / Teal",
        "var": "--tdei-green",
        "alias": "",
        "hex": "#479fa1",
        "rgb": "rgb(71, 159, 161)",
        "hsl": "hsl(181, 39%, 45%)",
        "category": "Brand Accent",
        "desc": "TDEI teal/green accent used for Pathways datasets, metric badges, and positive indicators.",
        "text_color": "#ffffff",
        "tags": ["green", "teal", "pathways", "accent", "metric"]
    },
    {
        "name": "TDEI Cyan / Button2",
        "var": "--tdei-cyan",
        "alias": ".tdei-button2",
        "hex": "#59c3c8",
        "rgb": "rgb(89, 195, 200)",
        "hsl": "hsl(183, 50%, 57%)",
        "category": "Interactive",
        "desc": "Cyan accent used for outline buttons (.tdei-button2) and refresh / quick action highlights.",
        "text_color": "#162848",
        "tags": ["cyan", "teal", "button", "interactive"]
    },
    {
        "name": "TDEI Maroon / Danger Action",
        "var": "--tdei-maroon",
        "alias": ".maroon-bg",
        "hex": "#c84349",
        "rgb": "rgb(200, 67, 73)",
        "hsl": "hsl(357, 54%, 52%)",
        "category": "Semantic",
        "desc": "TDEI maroon used for destructive action pill buttons (.maroon-bg), deactivations, and delete confirmations.",
        "text_color": "#ffffff",
        "tags": ["maroon", "red", "danger", "destructive", "delete", "pill"]
    }
]

purple_hierarchy = [
    {
        "name": "Purple Background Light",
        "var": "--purple-background-light",
        "hex": "#f4f0fb",
        "rgb": "rgb(244, 240, 251)",
        "category": "Surface",
        "desc": "Lightest purple tint for table active rows, info banners, highlight pills, and card backdrop shading.",
        "text_color": "#32006e",
        "tags": ["purple", "background", "light", "surface"]
    },
    {
        "name": "Purple Background Medium",
        "var": "--purple-background-medium",
        "hex": "#ebe4f6",
        "rgb": "rgb(235, 228, 246)",
        "category": "Surface",
        "desc": "Medium purple surface for badge backings, stepper indicators, and active dropdown items.",
        "text_color": "#32006e",
        "tags": ["purple", "background", "medium", "badge"]
    },
    {
        "name": "Purple Background Dark",
        "var": "--purple-background-dark",
        "hex": "#ddd2ee",
        "rgb": "rgb(221, 210, 238)",
        "category": "Surface / Divider",
        "desc": "Dark purple tint for subtle borders, section separators, and active control rings.",
        "text_color": "#32006e",
        "tags": ["purple", "background", "dark", "divider"]
    },
    {
        "name": "Purple Border Accent 1",
        "var": "--purple-border-soft",
        "hex": "#d8d1e9",
        "rgb": "rgb(216, 209, 233)",
        "category": "Border",
        "desc": "Soft purple border used in card headers and modal boundaries.",
        "text_color": "#32006e",
        "tags": ["purple", "border"]
    },
    {
        "name": "Purple Border Accent 2",
        "var": "--purple-border-subtle",
        "hex": "#e4ddf2",
        "rgb": "rgb(228, 221, 242)",
        "category": "Border",
        "desc": "Subtle card inner border and table header dividing line.",
        "text_color": "#32006e",
        "tags": ["purple", "border", "subtle"]
    }
]

neutrals_colors = [
    {
        "name": "Secondary Grey",
        "var": "--secondary-color",
        "hex": "#5f647a",
        "rgb": "rgb(95, 100, 122)",
        "category": "Text / Neutral",
        "desc": "Standard secondary text color for subtitles (.page-header-subtitle), hints (.tdei-hint-text), and muted labels.",
        "text_color": "#ffffff",
        "tags": ["secondary", "grey", "text", "subtitle"]
    },
    {
        "name": "Secondary Grey Alt",
        "var": "--secondary-color-alt",
        "hex": "#83879b",
        "rgb": "rgb(131, 135, 155)",
        "category": "Text / Neutral",
        "desc": "Alternative secondary text color used in public pages and lighter label contexts.",
        "text_color": "#ffffff",
        "tags": ["secondary", "grey", "text"]
    },
    {
        "name": "Deep Navy Text",
        "var": "--navy-text",
        "hex": "#162848",
        "rgb": "rgb(22, 40, 72)",
        "category": "Text / Neutral",
        "desc": "Deep high-contrast navy used for active nav tab text, job table headers, and primary data labels.",
        "text_color": "#ffffff",
        "tags": ["navy", "text", "header", "tabs", "jobs"]
    },
    {
        "name": "Dark Charcoal Text",
        "var": "--charcoal-text",
        "hex": "#111827",
        "rgb": "rgb(17, 24, 39)",
        "category": "Text / Neutral",
        "desc": "Dark charcoal text used in report headings, modal titles, and body emphasis.",
        "text_color": "#ffffff",
        "tags": ["text", "charcoal", "dark"]
    },
    {
        "name": "Body Text Grey",
        "var": "--body-text",
        "hex": "#374151",
        "rgb": "rgb(55, 65, 81)",
        "category": "Text / Neutral",
        "desc": "Standard body copy text color in forms, reports, and table rows.",
        "text_color": "#ffffff",
        "tags": ["text", "body"]
    },
    {
        "name": "Subtle Text Muted",
        "var": "--muted-text",
        "hex": "#6b7280",
        "rgb": "rgb(107, 114, 128)",
        "category": "Text / Neutral",
        "desc": "Muted description and timestamp text in list items and cards.",
        "text_color": "#ffffff",
        "tags": ["text", "muted", "timestamp"]
    },
    {
        "name": "Input / Control Border",
        "var": "--border-color",
        "hex": "#dee2e6",
        "rgb": "rgb(222, 226, 230)",
        "category": "Border / Neutral",
        "desc": "Standard Bootstrap form control border and table divider border.",
        "text_color": "#162848",
        "tags": ["border", "input", "form"]
    },
    {
        "name": "Card Border Subtle",
        "var": "--card-border",
        "hex": "#eeeeee",
        "rgb": "rgb(238, 238, 238)",
        "category": "Border / Neutral",
        "desc": "Border for .column-style and .section-style containers.",
        "text_color": "#162848",
        "tags": ["border", "card", "container"]
    },
    {
        "name": "Background Off-White",
        "var": "--bg-light",
        "hex": "#f8f8f8",
        "rgb": "rgb(248, 248, 248)",
        "category": "Surface / Neutral",
        "desc": "Subtle off-white background used for inner empty states, job containers, and secondary blocks.",
        "text_color": "#162848",
        "tags": ["background", "surface", "off-white"]
    },
    {
        "name": "Pure White",
        "var": "--white",
        "hex": "#ffffff",
        "rgb": "rgb(255, 255, 255)",
        "category": "Surface / Neutral",
        "desc": "Pure white background for cards (.column-style), modals, dropdown menus, and main content panels.",
        "text_color": "#162848",
        "tags": ["white", "background", "card"]
    }
]

semantic_colors = [
    {
        "name": "Success Green",
        "var": "--color-success",
        "hex": "#008000",
        "rgb": "rgb(0, 128, 0)",
        "category": "Semantic",
        "desc": "Success indicators, Job 'Completed' status chip, and validated schema checkmarks.",
        "text_color": "#ffffff",
        "tags": ["success", "completed", "green"]
    },
    {
        "name": "Warning Orange",
        "var": "--color-warning",
        "hex": "#c65d03",
        "rgb": "rgb(198, 93, 3)",
        "category": "Semantic",
        "desc": "Warning badges, overdue feedback indicator, pending alerts, and attention notices.",
        "text_color": "#ffffff",
        "tags": ["warning", "orange", "alert", "overdue"]
    },
    {
        "name": "Warning Amber Dark",
        "var": "--color-warning-dark",
        "hex": "#a04a00",
        "rgb": "rgb(160, 74, 0)",
        "category": "Semantic",
        "desc": "Deep amber warning text and caution tags.",
        "text_color": "#ffffff",
        "tags": ["warning", "amber"]
    },
    {
        "name": "Danger / Error Red",
        "var": "--color-danger",
        "hex": "#dc3545",
        "rgb": "rgb(220, 53, 69)",
        "category": "Semantic",
        "desc": "Job 'Failed' status chip, form validation error messages, and deletion triggers.",
        "text_color": "#ffffff",
        "tags": ["danger", "error", "failed", "red"]
    },
    {
        "name": "Info / Active Blue",
        "var": "--color-info",
        "hex": "#0969da",
        "rgb": "rgb(9, 105, 218)",
        "category": "Semantic",
        "desc": "Job ID hyperlinks, table sort triggers, and clickable inline links.",
        "text_color": "#ffffff",
        "tags": ["info", "blue", "link"]
    },
    {
        "name": "Focus Ring Blue",
        "var": "--color-focus-ring",
        "hex": "#2684ff",
        "rgb": "rgb(38, 132, 255)",
        "category": "Accessibility",
        "desc": "Accessibility focus-visible outline for buttons, links, and keyboard interactive controls (2px solid #2684ff).",
        "text_color": "#ffffff",
        "tags": ["focus", "accessibility", "ring", "blue"]
    }
]

all_colors = brand_colors + purple_hierarchy + neutrals_colors + semantic_colors

# Generate HTML
html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TDEI Brand & Design System Guide | Developer Documentation</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

  <style>
    :root {{
      --primary-font-family: "Open Sans", sans-serif;
      --secondary-font-family: "Montserrat", sans-serif;
      --code-font-family: "JetBrains Mono", monospace;
      --brand-primary: #32006e;
      --brand-accent: #4b2e83;
      --primary-color: var(--brand-primary);
      --primary-color-dark: var(--brand-primary);
      --secondary-color: #5f647a;
      --tdei-blue: #586ab5;
      --tdei-green: #479fa1;
      --purple-background-light: #f4f0fb;
      --purple-background-dark: #ddd2ee;
      --purple-background-medium: #ebe4f6;
      --white: #ffffff;
      
      --guide-bg: #f7f8fc;
      --guide-card-bg: #ffffff;
      --guide-border: #e6e8f0;
      --guide-text-main: #162848;
      --guide-text-muted: #5f647a;
      --guide-sidebar-w: 270px;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      font-family: var(--primary-font-family);
      color: var(--guide-text-main);
      background-color: var(--guide-bg);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      display: flex;
      min-height: 100vh;
    }}

    /* Sidebar Navigation */
    .sidebar {{
      width: var(--guide-sidebar-w);
      background-color: #1a0836;
      color: #e5def5;
      height: 100vh;
      position: sticky;
      top: 0;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 100;
      overflow-y: auto;
    }}

    .sidebar-header {{
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
      background: linear-gradient(180deg, rgba(75, 46, 131, 0.4) 0%, transparent 100%);
    }}

    .sidebar-logo-img {{
      height: 38px;
      background: #ffffff;
      padding: 4px 8px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }}

    .sidebar-title {{
      font-family: var(--secondary-font-family);
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.5px;
    }}

    .sidebar-subtitle {{
      font-size: 11px;
      color: #bfaee3;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 600;
      margin-top: 2px;
    }}

    .nav-list {{
      list-style: none;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }}

    .nav-section-title {{
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: #9283b9;
      padding: 12px 12px 6px 12px;
    }}

    .nav-item a {{
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #d5cced;
      text-decoration: none;
      font-size: 13.5px;
      font-weight: 500;
      transition: all 0.2s ease;
    }}

    .nav-item a:hover {{
      background-color: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      transform: translateX(3px);
    }}

    .nav-item a.active {{
      background: linear-gradient(90deg, #4b2e83 0%, #32006e 100%);
      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }}

    .nav-badge {{
      margin-left: auto;
      background: rgba(255, 255, 255, 0.15);
      font-size: 10.5px;
      padding: 2px 6px;
      border-radius: 10px;
      font-weight: 600;
      color: #ffffff;
    }}

    .sidebar-footer {{
      padding: 16px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 12px;
      color: #8f82af;
      text-align: center;
    }}

    /* Main Container */
    .main-wrapper {{
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }}

    /* Top Sticky Action Bar */
    .top-bar {{
      position: sticky;
      top: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--guide-border);
      padding: 12px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      z-index: 90;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
    }}

    .search-box {{
      position: relative;
      flex: 1;
      max-width: 460px;
    }}

    .search-box input {{
      width: 100%;
      padding: 9px 14px 9px 38px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 13.5px;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
      background-color: #f9fafb;
    }}

    .search-box input:focus {{
      background-color: #ffffff;
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 3px rgba(50, 0, 110, 0.12);
    }}

    .search-icon-pos {{
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      width: 16px;
      height: 16px;
    }}

    .top-actions {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .copy-mode-selector {{
      display: flex;
      align-items: center;
      background: #eef1f6;
      border-radius: 8px;
      padding: 3px;
      font-size: 12px;
      font-weight: 600;
    }}

    .copy-mode-label {{
      padding: 4px 8px;
      color: var(--guide-text-muted);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    .mode-btn {{
      padding: 5px 10px;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      font-size: 11.5px;
      font-weight: 600;
      color: #4b5563;
      transition: all 0.15s;
    }}

    .mode-btn.active {{
      background: var(--brand-primary);
      color: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }}

    .action-btn {{
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #d1d5db;
      background: #ffffff;
      color: var(--guide-text-main);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
    }}

    .action-btn:hover {{
      background: #f3f4f6;
      border-color: #9ca3af;
    }}

    .action-btn-primary {{
      background: var(--brand-primary);
      color: #ffffff;
      border-color: var(--brand-primary);
    }}

    .action-btn-primary:hover {{
      background: var(--brand-accent);
      border-color: var(--brand-accent);
    }}

    /* Main Content Area */
    .content-area {{
      padding: 32px 40px 64px 40px;
      max-width: 1440px;
      width: 100%;
      margin: 0 auto;
    }}

    /* Hero Banner */
    .guide-hero {{
      background: linear-gradient(135deg, #32006e 0%, #4b2e83 60%, #586ab5 100%);
      border-radius: 16px;
      padding: 36px 40px;
      color: #ffffff;
      margin-bottom: 36px;
      box-shadow: 0 10px 30px rgba(50, 0, 110, 0.18);
      position: relative;
      overflow: hidden;
    }}

    .guide-hero::after {{
      content: "";
      position: absolute;
      right: -40px;
      bottom: -40px;
      width: 260px;
      height: 260px;
      background: radial-gradient(circle, rgba(89, 195, 200, 0.25) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }}

    .hero-title-row {{
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }}

    .hero-title {{
      font-family: var(--secondary-font-family);
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }}

    .hero-tag {{
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.35);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    .hero-desc {{
      font-size: 15px;
      color: #e5def5;
      max-width: 780px;
      line-height: 1.6;
      margin-bottom: 24px;
    }}

    .hero-stats-row {{
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
    }}

    .hero-stat-card {{
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 10px 18px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .hero-stat-num {{
      font-size: 22px;
      font-weight: 800;
      font-family: var(--secondary-font-family);
      color: #59c3c8;
    }}

    .hero-stat-label {{
      font-size: 12px;
      color: #e5def5;
      font-weight: 500;
    }}

    /* Section Styles */
    .guide-section {{
      margin-bottom: 48px;
      scroll-margin-top: 80px;
    }}

    .section-header-block {{
      margin-bottom: 20px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 12px;
    }}

    .section-title-wrap {{
      display: flex;
      flex-direction: column;
      gap: 4px;
    }}

    .section-main-title {{
      font-family: var(--secondary-font-family);
      font-size: 22px;
      font-weight: 700;
      color: var(--brand-primary);
      display: flex;
      align-items: center;
      gap: 10px;
    }}

    .section-desc {{
      font-size: 13.5px;
      color: var(--guide-text-muted);
    }}

    /* Subsection */
    .subsection-title {{
      font-family: var(--secondary-font-family);
      font-size: 16px;
      font-weight: 700;
      color: #1f2937;
      margin: 24px 0 14px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    /* Color Grid */
    .color-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 18px;
    }}

    .color-card {{
      background: var(--guide-card-bg);
      border-radius: 12px;
      border: 1px solid var(--guide-border);
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
    }}

    .color-card:hover {{
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
    }}

    .color-swatch-box {{
      height: 100px;
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 12px;
    }}

    .color-swatch-border {{
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }}

    .color-wcag-badge {{
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.4);
      color: #ffffff;
      backdrop-filter: blur(4px);
    }}

    .color-card-body {{
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}

    .color-card-name {{
      font-family: var(--secondary-font-family);
      font-size: 14.5px;
      font-weight: 700;
      color: var(--guide-text-main);
    }}

    .color-meta-row {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: var(--code-font-family);
      font-size: 12px;
      color: #4b5563;
      background: #f8fafc;
      padding: 4px 8px;
      border-radius: 5px;
      border: 1px solid #f1f5f9;
    }}

    .color-code {{
      font-weight: 600;
    }}

    .color-var-name {{
      font-family: var(--code-font-family);
      font-size: 11px;
      color: var(--brand-primary);
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }}

    .color-card-desc {{
      font-size: 12px;
      color: var(--guide-text-muted);
      line-height: 1.4;
      margin-top: 4px;
    }}

    .color-copy-hint {{
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.6);
      color: #ffffff;
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 12px;
      opacity: 0;
      transition: opacity 0.2s;
    }}

    .color-card:hover .color-copy-hint {{
      opacity: 1;
    }}

    /* Typography Section */
    .type-spec-table {{
      width: 100%;
      background: var(--guide-card-bg);
      border-radius: 12px;
      border: 1px solid var(--guide-border);
      border-collapse: separate;
      border-spacing: 0;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      margin-bottom: 24px;
    }}

    .type-spec-table th {{
      background: #f8fafc;
      padding: 12px 18px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--guide-text-muted);
      border-bottom: 1px solid var(--guide-border);
      text-align: left;
    }}

    .type-spec-table td {{
      padding: 16px 18px;
      border-bottom: 1px solid var(--guide-border);
      vertical-align: middle;
      font-size: 13.5px;
    }}

    .type-spec-table tr:last-child td {{
      border-bottom: none;
    }}

    .type-preview-cell {{
      min-width: 280px;
    }}

    /* Icon Gallery */
    .icon-controls-bar {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
      flex-wrap: wrap;
      background: #ffffff;
      padding: 12px 16px;
      border-radius: 10px;
      border: 1px solid var(--guide-border);
    }}

    .icon-filter-group {{
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }}

    .icon-filter-chip {{
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      color: #4b5563;
      cursor: pointer;
      transition: all 0.15s;
    }}

    .icon-filter-chip:hover {{
      background: #f3f4f6;
      border-color: #d1d5db;
    }}

    .icon-filter-chip.active {{
      background: var(--brand-primary);
      color: #ffffff;
      border-color: var(--brand-primary);
    }}

    .icon-bg-switcher {{
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--guide-text-muted);
    }}

    .icon-bg-dot {{
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid #d1d5db;
      cursor: pointer;
    }}

    .icon-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 16px;
    }}

    .icon-card {{
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid var(--guide-border);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.2s ease;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
      position: relative;
    }}

    .icon-card:hover {{
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
      border-color: #cbd5e1;
    }}

    .icon-preview-box {{
      height: 86px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fafafa;
      border-bottom: 1px solid #f0f0f0;
      padding: 12px;
      position: relative;
    }}

    .icon-preview-box svg {{
      max-width: 42px;
      max-height: 42px;
      width: auto;
      height: auto;
      object-fit: contain;
    }}

    .icon-preview-box img {{
      max-width: 42px;
      max-height: 42px;
      width: auto;
      height: auto;
      object-fit: contain;
    }}

    .icon-card-info {{
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }}

    .icon-name {{
      font-family: var(--code-font-family);
      font-size: 11.5px;
      font-weight: 600;
      color: var(--guide-text-main);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }}

    .icon-category-tag {{
      font-size: 10.5px;
      color: var(--guide-text-muted);
    }}

    .icon-actions-row {{
      display: flex;
      gap: 4px;
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid #f1f5f9;
    }}

    .icon-copy-btn {{
      flex: 1;
      padding: 4px 6px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      font-size: 10.5px;
      font-weight: 600;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s;
      text-align: center;
    }}

    .icon-copy-btn:hover {{
      background: var(--brand-primary);
      color: #ffffff;
      border-color: var(--brand-primary);
    }}

    /* Component Showcases */
    .components-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
      gap: 24px;
    }}

    .component-box {{
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid var(--guide-border);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }}

    .component-box-header {{
      padding: 14px 20px;
      background: #f8fafc;
      border-bottom: 1px solid var(--guide-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .component-box-title {{
      font-family: var(--secondary-font-family);
      font-size: 14.5px;
      font-weight: 700;
      color: var(--guide-text-main);
    }}

    .component-preview-area {{
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
      flex: 1;
    }}

    .component-code-area {{
      background: #1e1b2e;
      color: #f1f5f9;
      padding: 14px 18px;
      font-family: var(--code-font-family);
      font-size: 12px;
      position: relative;
      border-top: 1px solid #2d2645;
    }}

    .code-copy-btn {{
      position: absolute;
      top: 10px;
      right: 12px;
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      border: none;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }}

    .code-copy-btn:hover {{
      background: var(--brand-accent);
    }}

    /* TDEI Live Native Components Styles */
    .tdei-primary-button {{
      background-color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      color: #fff !important;
      font-weight: 600 !important;
      border-radius: 4px !important;
      padding: 8px 16px;
      font-size: 14px;
      border: 1px solid transparent;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }}

    .tdei-primary-button:hover {{
      background-color: var(--brand-accent) !important;
      border-color: var(--brand-accent) !important;
    }}

    .tdei-secondary-button {{
      border: 1px solid var(--secondary-color);
      color: var(--secondary-color);
      background: transparent;
      font-weight: 600 !important;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }}

    .tdei-secondary-button:hover {{
      background-color: var(--secondary-color);
      color: #fff;
    }}

    .tdei-rounded-button {{
      background-color: var(--primary-color) !important;
      border: 1px solid var(--primary-color) !important;
      color: #fff !important;
      font-weight: 600;
      border-radius: 100px;
      padding: 8px 20px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }}

    .tdei-rounded-button:hover {{
      background-color: var(--brand-accent) !important;
      border-color: var(--brand-accent) !important;
    }}

    .tdei-button2 {{
      color: #59c3c8 !important;
      font-weight: 600;
      border: 2px solid #59c3c8;
      background: transparent;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }}

    .tdei-button2:hover {{
      background: #59c3c8;
      color: #ffffff !important;
    }}

    .maroon-bg {{
      background-color: #c84349 !important;
      border: 1px solid #c84349 !important;
      color: #fff !important;
      font-weight: 600;
      border-radius: 100px;
      padding: 8px 20px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }}

    .maroon-bg:hover {{
      background-color: #b0383e !important;
      border-color: #b0383e !important;
    }}

    .tdei-primary-link {{
      color: var(--primary-color);
      font-weight: 600;
      text-decoration: none;
      font-size: 14px;
    }}

    .tdei-primary-link:hover {{
      color: var(--brand-accent);
      text-decoration: underline;
    }}

    .tdei-disabled-btn {{
      background-color: #cccccc !important;
      border-color: #cccccc !important;
      color: #ffffff !important;
      cursor: not-allowed;
      border-radius: 4px;
      padding: 8px 16px;
      font-weight: 600;
      border: none;
    }}

    /* Form Controls */
    .tdei-input {{
      width: 100%;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid #dee2e6;
      font-size: 14px;
      font-family: inherit;
      color: #212529;
      outline: none;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }}

    .tdei-input:focus {{
      border-color: var(--brand-primary);
      box-shadow: 0 0 0 0.25rem rgba(135, 62, 242, 0.25);
    }}

    .tdei-checkbox {{
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      border: 1.5px solid var(--secondary-color);
      cursor: pointer;
      position: relative;
      vertical-align: middle;
    }}

    .tdei-checkbox:checked {{
      background-color: var(--primary-color);
      border: 1.5px solid var(--primary-color);
    }}

    .tdei-checkbox:checked::after {{
      content: "✓";
      color: #ffffff;
      font-size: 13px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
    }}

    .tdei-radio {{
      accent-color: var(--primary-color);
      width: 17px;
      height: 17px;
      cursor: pointer;
    }}

    /* Badges & Chips */
    .badge-status {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }}

    .badge-completed {{
      background-color: #e6f4ea;
      color: #008000;
      border: 1px solid #ceead6;
    }}

    .badge-in-progress {{
      background-color: #e8f0fe;
      color: #0969da;
      border: 1px solid #c7d2fe;
    }}

    .badge-failed {{
      background-color: #fce8e6;
      color: #dc3545;
      border: 1px solid #fad2cf;
    }}

    .badge-abandoned {{
      background-color: #f1f3f4;
      color: #5f647a;
      border: 1px solid #dadce0;
    }}

    .badge-type-osw {{
      background-color: #eef2ff;
      color: #586ab5;
      border: 1px solid #c7d2fe;
      font-weight: 700;
    }}

    .badge-type-pathways {{
      background-color: #e6f7f7;
      color: #479fa1;
      border: 1px solid #b3e5e6;
      font-weight: 700;
    }}

    .badge-type-flex {{
      background-color: #f4f0fb;
      color: #4b2e83;
      border: 1px solid #ddd2ee;
      font-weight: 700;
    }}

    .badge-role-poc {{
      background-color: #f4f0fb;
      color: #32006e;
      border: 1px solid #ddd2ee;
      font-weight: 700;
    }}

    .badge-role-admin {{
      background-color: #32006e;
      color: #ffffff;
      font-weight: 700;
    }}

    /* Card & Container Samples */
    .column-style {{
      background: #ffffff;
      box-shadow: 0px 1px 12px #0000000d;
      border: 1px solid #eeeeee;
      border-radius: 8px;
      padding: 20px;
      width: 100%;
    }}

    .serviceDetailsContainer {{
      background: #ffffff;
      border: 1px solid #ddd;
      box-shadow: 0px 1px 6px #33333314;
      border-radius: 5px;
      border-left: 8px solid var(--tdei-blue);
      width: 100%;
      overflow: hidden;
    }}

    .serviceIdBlock {{
      border-top: 1px dashed #ddd;
      padding: 8px 20px;
      background-color: #fbfbfb;
      font-size: 13px;
      color: var(--secondary-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    /* KPI Cards */
    .kpi-card {{
      background: #ffffff;
      border: 1px solid #eeeeee;
      box-shadow: 0px 1px 12px #0000000d;
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      width: 100%;
    }}

    .kpi-icon-box {{
      width: 48px;
      height: 48px;
      background: var(--purple-background-light);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .kpi-val {{
      font-size: 24px;
      font-weight: 700;
      color: var(--guide-text-main);
      font-family: var(--secondary-font-family);
    }}

    .kpi-title {{
      font-size: 13px;
      color: var(--secondary-color);
      font-weight: 500;
    }}

    /* Tabs Preview */
    .tdei-nav-tabs {{
      display: flex;
      border-bottom: 1px solid #dee2e6;
      list-style: none;
      width: 100%;
      gap: 16px;
    }}

    .tdei-tab-link {{
      color: var(--secondary-color);
      padding: 10px 4px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      cursor: pointer;
      border-bottom: 4px solid transparent;
      transition: all 0.15s;
    }}

    .tdei-tab-link.active {{
      color: #162848;
      border-bottom: 4px solid var(--primary-color);
    }}

    /* Toast Notification */
    .toast-notification {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1a0836;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13.5px;
      z-index: 1000;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
    }}

    .toast-notification.show {{
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }}

    .toast-check {{
      color: #59c3c8;
      font-size: 16px;
      font-weight: bold;
    }}

    /* Cheat Sheet Code Blocks */
    .code-export-box {{
      background: #1a162b;
      border-radius: 12px;
      border: 1px solid #2d2645;
      padding: 20px;
      color: #f1f5f9;
      font-family: var(--code-font-family);
      font-size: 13px;
      position: relative;
      overflow-x: auto;
      line-height: 1.6;
    }}

    /* Responsive */
    @media (max-width: 900px) {{
      body {{
        flex-direction: column;
      }}
      .sidebar {{
        width: 100%;
        height: auto;
        position: relative;
      }}
      .top-bar {{
        flex-direction: column;
        align-items: stretch;
      }}
      .content-area {{
        padding: 20px;
      }}
    }}
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="assets/img/tdei_logo.svg" alt="TDEI Logo" class="sidebar-logo-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 100 40\\'><text y=\\'28\\' font-size=\\'28\\' font-weight=\\'bold\\' fill=\\'%2332006e\\'>TDEI</text></svg>'" />
      <div>
        <div class="sidebar-title">TDEI Guide</div>
        <div class="sidebar-subtitle">Design System</div>
      </div>
    </div>

    <ul class="nav-list">
      <li class="nav-section-title">Design Tokens</li>
      <li class="nav-item"><a href="#colors" class="active"><span>🎨</span> Color Palette <span class="nav-badge">{len(all_colors)}</span></a></li>
      <li class="nav-item"><a href="#typography"><span>🔤</span> Typography & Scale <span class="nav-badge">7</span></a></li>
      <li class="nav-item"><a href="#icons"><span>🖼️</span> Icon Library <span class="nav-badge">{len(assets_data)}</span></a></li>
      
      <li class="nav-section-title">UI Components</li>
      <li class="nav-item"><a href="#buttons"><span>🔘</span> Buttons & Links <span class="nav-badge">6</span></a></li>
      <li class="nav-item"><a href="#badges"><span>🏷️</span> Badges & Tags <span class="nav-badge">9</span></a></li>
      <li class="nav-item"><a href="#forms"><span>📋</span> Forms & Controls <span class="nav-badge">5</span></a></li>
      <li class="nav-item"><a href="#containers"><span>🃏</span> Cards & Layouts <span class="nav-badge">4</span></a></li>
      <li class="nav-item"><a href="#modals"><span>💬</span> Modals & Feedback <span class="nav-badge">3</span></a></li>
      
      <li class="nav-section-title">Developer Tools</li>
      <li class="nav-item"><a href="#cheatsheet"><span>💻</span> Quick Code Snippets <span class="nav-badge">Export</span></a></li>
    </ul>

    <div class="sidebar-footer">
      <div>Taskar Center @ UW</div>
      <div style="font-size: 10.5px; opacity: 0.7; margin-top: 2px;">TDEI User Management v1.0</div>
    </div>
  </aside>

  <!-- Main Content Wrapper -->
  <div class="main-wrapper">
    
    <!-- Top Action Bar -->
    <header class="top-bar">
      <div class="search-box">
        <svg class="search-icon-pos" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" id="globalSearchInput" placeholder="Search colors, icons, classes, hex codes... (Press '/' to search)" />
      </div>

      <div class="top-actions">
        <div class="copy-mode-selector">
          <span class="copy-mode-label">Copy:</span>
          <button class="mode-btn active" data-mode="hex" onclick="setCopyMode('hex')">HEX</button>
          <button class="mode-btn" data-mode="var" onclick="setCopyMode('var')">CSS Var</button>
          <button class="mode-btn" data-mode="rgb" onclick="setCopyMode('rgb')">RGB</button>
          <button class="mode-btn" data-mode="react" onclick="setCopyMode('react')">React</button>
        </div>

        <button class="action-btn action-btn-primary" onclick="copyCssVariables()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy :root CSS
        </button>

        <button class="action-btn" onclick="exportTokensJson()">
          Export JSON
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="content-area">

      <!-- Hero Banner -->
      <div class="guide-hero">
        <div class="hero-title-row">
          <h1 class="hero-title">TDEI Developer Brand & Style Guide</h1>
          <span class="hero-tag">Engineering Reference</span>
        </div>
        <p class="hero-desc">
          The single source of truth for Transportation Data Equity Initiative (TDEI) design tokens, brand palettes, SVG icon sets, typography scales, and UI component styles. Click any item to copy its code directly to your clipboard.
        </p>

        <div class="hero-stats-row">
          <div class="hero-stat-card">
            <div class="hero-stat-num">{len(all_colors)}</div>
            <div class="hero-stat-label">Unique Colors & Tokens</div>
          </div>
          <div class="hero-stat-card">
            <div class="hero-stat-num">{len(assets_data)}</div>
            <div class="hero-stat-label">Icons & Image Assets</div>
          </div>
          <div class="hero-stat-card">
            <div class="hero-stat-num">3</div>
            <div class="hero-stat-label">Font Families Loaded</div>
          </div>
          <div class="hero-stat-card">
            <div class="hero-stat-num">100%</div>
            <div class="hero-stat-label">Copy-Ready Snippets</div>
          </div>
        </div>
      </div>

      <!-- SECTION: COLOR PALETTE -->
      <section id="colors" class="guide-section">
        <div class="section-header-block">
          <div class="section-title-wrap">
            <h2 class="section-main-title"><span>🎨</span> Brand & Color Palette</h2>
            <div class="section-desc">Click any color card to instantly copy its value in the active format.</div>
          </div>
        </div>

        <h3 class="subsection-title">1. Primary Brand & Accent Colors</h3>
        <div class="color-grid">
"""

# Render Brand Colors
for c in brand_colors:
    html_content += f"""
          <div class="color-card" onclick="copyColor('{c['hex']}', '{c['var']}', '{c['rgb']}')" data-search="{c['name'].lower()} {c['hex'].lower()} {c['var'].lower()} {' '.join(c['tags'])}">
            <div class="color-swatch-box color-swatch-border" style="background-color: {c['hex']};">
              <span class="color-wcag-badge">WCAG AAA</span>
              <span class="color-copy-hint">Click to Copy</span>
            </div>
            <div class="color-card-body">
              <div class="color-card-name">{c['name']}</div>
              <div class="color-meta-row">
                <span class="color-code">{c['hex']}</span>
                <span class="color-code" style="color: #6b7280; font-size: 11px;">{c['rgb']}</span>
              </div>
              <div class="color-var-name">{c['var']}</div>
              <div class="color-card-desc">{c['desc']}</div>
            </div>
          </div>
"""

html_content += """
        </div>

        <h3 class="subsection-title">2. TDEI Purple Hierarchy & Backgrounds</h3>
        <div class="color-grid">
"""

for c in purple_hierarchy:
    html_content += f"""
          <div class="color-card" onclick="copyColor('{c['hex']}', '{c['var']}', '{c['rgb']}')" data-search="{c['name'].lower()} {c['hex'].lower()} {c['var'].lower()} {' '.join(c['tags'])}">
            <div class="color-swatch-box color-swatch-border" style="background-color: {c['hex']};">
              <span class="color-wcag-badge" style="background: rgba(50,0,110,0.2); color: #32006e;">Surface</span>
              <span class="color-copy-hint">Click to Copy</span>
            </div>
            <div class="color-card-body">
              <div class="color-card-name">{c['name']}</div>
              <div class="color-meta-row">
                <span class="color-code">{c['hex']}</span>
                <span class="color-code" style="color: #6b7280; font-size: 11px;">{c['rgb']}</span>
              </div>
              <div class="color-var-name">{c['var']}</div>
              <div class="color-card-desc">{c['desc']}</div>
            </div>
          </div>
"""

html_content += """
        </div>

        <h3 class="subsection-title">3. Neutrals, Slates & Surface Greys</h3>
        <div class="color-grid">
"""

for c in neutrals_colors:
    html_content += f"""
          <div class="color-card" onclick="copyColor('{c['hex']}', '{c['var']}', '{c['rgb']}')" data-search="{c['name'].lower()} {c['hex'].lower()} {c['var'].lower()} {' '.join(c['tags'])}">
            <div class="color-swatch-box color-swatch-border" style="background-color: {c['hex']};">
              <span class="color-copy-hint">Click to Copy</span>
            </div>
            <div class="color-card-body">
              <div class="color-card-name">{c['name']}</div>
              <div class="color-meta-row">
                <span class="color-code">{c['hex']}</span>
                <span class="color-code" style="color: #6b7280; font-size: 11px;">{c['rgb']}</span>
              </div>
              <div class="color-var-name">{c['var']}</div>
              <div class="color-card-desc">{c['desc']}</div>
            </div>
          </div>
"""

html_content += """
        </div>

        <h3 class="subsection-title">4. Semantic, Status & Accessibility Focus</h3>
        <div class="color-grid">
"""

for c in semantic_colors:
    html_content += f"""
          <div class="color-card" onclick="copyColor('{c['hex']}', '{c['var']}', '{c['rgb']}')" data-search="{c['name'].lower()} {c['hex'].lower()} {c['var'].lower()} {' '.join(c['tags'])}">
            <div class="color-swatch-box color-swatch-border" style="background-color: {c['hex']};">
              <span class="color-copy-hint">Click to Copy</span>
            </div>
            <div class="color-card-body">
              <div class="color-card-name">{c['name']}</div>
              <div class="color-meta-row">
                <span class="color-code">{c['hex']}</span>
                <span class="color-code" style="color: #6b7280; font-size: 11px;">{c['rgb']}</span>
              </div>
              <div class="color-var-name">{c['var']}</div>
              <div class="color-card-desc">{c['desc']}</div>
            </div>
          </div>
"""

html_content += """
        </div>
      </section>

      <!-- SECTION: TYPOGRAPHY -->
      <section id="typography" class="guide-section">
        <div class="section-header-block">
          <div class="section-title-wrap">
            <h2 class="section-main-title"><span>🔤</span> Typography & Type Scale</h2>
            <div class="section-desc">Google Fonts loaded: Open Sans (Primary), Montserrat (Headers), Lato.</div>
          </div>
        </div>

        <table class="type-spec-table">
          <thead>
            <tr>
              <th>Class / Role</th>
              <th>Font Family & Weight</th>
              <th>Size / Line Height</th>
              <th>Preview</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>.page-header-title</strong><br />
                <span style="font-size: 11px; color: var(--secondary-color);">Primary Page Heading</span>
              </td>
              <td>Montserrat 700 Bold</td>
              <td>24px / 1.3</td>
              <td class="type-preview-cell">
                <div style="font-family: var(--secondary-font-family); font-size: 24px; font-weight: 700; color: #162848;">
                  Datasets Overview
                </div>
              </td>
              <td>
                <button class="action-btn" onclick="copySnippet('.page-header-title { font-family: var(--secondary-font-family); font-size: 24px; font-weight: 700; margin-bottom: 5px; }')">Copy CSS</button>
              </td>
            </tr>

            <tr>
              <td>
                <strong>.page-header-subtitle</strong><br />
                <span style="font-size: 11px; color: var(--secondary-color);">Sub-heading under title</span>
              </td>
              <td>Montserrat 400 Regular</td>
              <td>14px / 1.4</td>
              <td class="type-preview-cell">
                <div style="font-family: var(--secondary-font-family); font-size: 14px; color: var(--secondary-color);">
                  Manage and publish TDEI transport datasets
                </div>
              </td>
              <td>
                <button class="action-btn" onclick="copySnippet('.page-header-subtitle { font-family: var(--secondary-font-family); font-size: 14px; color: var(--secondary-color); }')">Copy CSS</button>
              </td>
            </tr>

            <tr>
              <td>
                <strong>.formTitle</strong><br />
                <span style="font-size: 11px; color: var(--secondary-color);">Form & Modal Headings</span>
              </td>
              <td>Montserrat 300 Light</td>
              <td>26px / 1.3</td>
              <td class="type-preview-cell">
                <div style="font-family: var(--secondary-font-family); font-size: 26px; font-weight: 300; color: #162848;">
                  Create New Service
                </div>
              </td>
              <td>
                <button class="action-btn" onclick="copySnippet('.formTitle { font-family: var(--secondary-font-family); font-size: 26px; font-weight: 300; margin-bottom: 2px; }')">Copy CSS</button>
              </td>
            </tr>

            <tr>
              <td>
                <strong>.tdei-bold-name</strong><br />
                <span style="font-size: 11px; color: var(--secondary-color);">Item / Row Title</span>
              </td>
              <td>Open Sans 700 Bold</td>
              <td>16px / 1.4</td>
              <td class="type-preview-cell">
                <div style="font-family: var(--primary-font-family); font-size: 16px; font-weight: 700; color: #162848;">
                  King County Metro Transit
                </div>
              </td>
              <td>
                <button class="action-btn" onclick="copySnippet('.tdei-bold-name { font-size: 16px; font-weight: 700; margin-bottom: 8px; }')">Copy CSS</button>
              </td>
            </tr>

            <tr>
              <td>
                <strong>.tdei-name-desc</strong><br />
                <span style="font-size: 11px; color: var(--secondary-color);">Secondary metadata text</span>
              </td>
              <td>Open Sans 400 Regular</td>
              <td>14px / 1.5</td>
              <td class="type-preview-cell">
                <div style="font-family: var(--primary-font-family); font-size: 14px; color: var(--secondary-color);">
                  Last modified 2 days ago by admin@uw.edu
                </div>
              </td>
              <td>
                <button class="action-btn" onclick="copySnippet('.tdei-name-desc { font-size: 14px; color: var(--secondary-color); }')">Copy CSS</button>
              </td>
            </tr>

            <tr>
              <td>
                <strong>.tdei-hint-text</strong><br />
                <span style="font-size: 11px; color: var(--secondary-color);">Helper / Guideline hint</span>
              </td>
              <td>Open Sans 400 Italic</td>
              <td>14px / 1.4</td>
              <td class="type-preview-cell">
                <div style="font-family: var(--primary-font-family); font-size: 14px; color: var(--secondary-color); font-style: italic;">
                  * Enter a valid GeoJSON bounding box or point coordinate
                </div>
              </td>
              <td>
                <button class="action-btn" onclick="copySnippet('.tdei-hint-text { font-size: 14px; color: var(--secondary-color); font-style: italic; }')">Copy CSS</button>
              </td>
            </tr>

            <tr>
              <td>
                <strong>.apiKey / .jsonContent</strong><br />
                <span style="font-size: 11px; color: var(--secondary-color);">API keys, IDs, Code blocks</span>
              </td>
              <td>JetBrains Mono / Consolas</td>
              <td>13px / 1.5</td>
              <td class="type-preview-cell">
                <div style="font-family: var(--code-font-family); font-size: 13px; color: var(--brand-primary); background: #f4f0fb; padding: 4px 8px; border-radius: 4px; display: inline-block;">
                  tdei_proj_98fa32bc-44e2-4791
                </div>
              </td>
              <td>
                <button class="action-btn" onclick="copySnippet('.apiKey { font-family: monospace; border-top: 1px dashed #b5b5b5; margin-top: 10px; padding-top: 10px; }')">Copy CSS</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- SECTION: ICON GALLERY -->
      <section id="icons" class="guide-section">
        <div class="section-header-block">
          <div class="section-title-wrap">
            <h2 class="section-main-title"><span>🖼️</span> Complete Icon System</h2>
            <div class="section-desc">Total 92 curated icons and visual assets. Click any action button to copy the SVG code, React import, or JSX tag.</div>
          </div>
        </div>

        <div class="icon-controls-bar">
          <div class="icon-filter-group" id="iconFilterChips">
            <button class="icon-filter-chip active" onclick="filterIcons('all')">All Icons ({len(assets_data)})</button>
"""

for cat in categories:
    count = len(categories[cat])
    html_content += f"""            <button class="icon-filter-chip" onclick="filterIcons('{cat}')">{cat} ({count})</button>\n"""

html_content += """
          </div>

          <div class="icon-bg-switcher">
            <span>Preview BG:</span>
            <div class="icon-bg-dot" style="background: #ffffff;" onclick="setIconPreviewBg('#ffffff')" title="White"></div>
            <div class="icon-bg-dot" style="background: #f4f0fb;" onclick="setIconPreviewBg('#f4f0fb')" title="Purple Light"></div>
            <div class="icon-bg-dot" style="background: #1a0836;" onclick="setIconPreviewBg('#1a0836')" title="Dark Purple"></div>
          </div>
        </div>

        <div class="icon-grid" id="iconGridContainer">
"""

# Render all icons
for fname, asset_content in assets_data.items():
    # find category
    cat_found = "General"
    for cname, flist in categories.items():
        if fname in flist:
            cat_found = cname
            break

    is_svg = fname.endswith('.svg')
    
    # create preview html
    if is_svg:
        # render SVG directly
        preview_markup = asset_content
    else:
        preview_markup = f'<img src="{asset_content}" alt="{fname}" />'

    clean_var_name = re.sub(r'[^a-zA-Z0-9]', '', fname.replace('.svg', '').replace('.png', '').replace('-', ' ').title())
    if clean_var_name:
        clean_var_name = clean_var_name[0].lower() + clean_var_name[1:] + "Icon"

    html_content += f"""
          <div class="icon-card" data-category="{cat_found}" data-filename="{fname}" data-search="{fname.lower()} {cat_found.lower()} {clean_var_name.lower()}">
            <div class="icon-preview-box">
              {preview_markup}
            </div>
            <div class="icon-card-info">
              <div class="icon-name" title="{fname}">{fname}</div>
              <div class="icon-category-tag">{cat_found}</div>
              <div class="icon-actions-row">
                <button class="icon-copy-btn" onclick="copyIconImport('{fname}', '{clean_var_name}')" title="Copy React import statement">Import</button>
                <button class="icon-copy-btn" onclick="copyIconJsx('{clean_var_name}')" title="Copy JSX img tag">JSX</button>
                <button class="icon-copy-btn" onclick="copyIconSvgCode('{fname}')" title="Copy SVG / Image data">{'SVG' if is_svg else 'Data'}</button>
              </div>
            </div>
          </div>
"""

html_content += """
        </div>
      </section>

      <!-- SECTION: BUTTONS & CONTROLS -->
      <section id="buttons" class="guide-section">
        <div class="section-header-block">
          <div class="section-title-wrap">
            <h2 class="section-main-title"><span>🔘</span> Buttons & Interactive Controls</h2>
            <div class="section-desc">Standard TDEI button classes with hover, active, and accessible focus states.</div>
          </div>
        </div>

        <div class="components-grid">
          
          <!-- Primary Button -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">.tdei-primary-button</span>
              <span style="font-size: 11.5px; color: var(--brand-primary); font-weight: 600;">Main Call to Action</span>
            </div>
            <div class="component-preview-area">
              <button class="tdei-primary-button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Create Project Group
              </button>
              <button class="tdei-primary-button" style="padding: 10px 24px; font-size: 15px;">Large Action Button</button>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<Button className=\\'tdei-primary-button\\'>Create Project Group</Button>')">Copy JSX</button>
              <code>&lt;Button className="tdei-primary-button"&gt;<br />&nbsp;&nbsp;Create Project Group<br />&lt;/Button&gt;</code>
            </div>
          </div>

          <!-- Secondary Button -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">.tdei-secondary-button</span>
              <span style="font-size: 11.5px; color: var(--secondary-color); font-weight: 600;">Secondary / Cancel</span>
            </div>
            <div class="component-preview-area">
              <button class="tdei-secondary-button">Cancel Operation</button>
              <button class="tdei-secondary-button">View Documentation</button>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<Button className=\\'tdei-secondary-button\\'>Cancel Operation</Button>')">Copy JSX</button>
              <code>&lt;Button className="tdei-secondary-button"&gt;<br />&nbsp;&nbsp;Cancel Operation<br />&lt;/Button&gt;</code>
            </div>
          </div>

          <!-- Rounded Button -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">.tdei-rounded-button</span>
              <span style="font-size: 11.5px; color: var(--brand-primary); font-weight: 600;">Pill Style Primary</span>
            </div>
            <div class="component-preview-area">
              <button class="tdei-rounded-button">Upload Dataset</button>
              <button class="tdei-rounded-button">Assign Roles</button>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<Button className=\\'tdei-rounded-button\\'>Upload Dataset</Button>')">Copy JSX</button>
              <code>&lt;Button className="tdei-rounded-button"&gt;<br />&nbsp;&nbsp;Upload Dataset<br />&lt;/Button&gt;</code>
            </div>
          </div>

          <!-- Button2 Cyan -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">.tdei-button2 (Cyan Accent)</span>
              <span style="font-size: 11.5px; color: #59c3c8; font-weight: 700;">Refresh / Secondary Action</span>
            </div>
            <div class="component-preview-area">
              <button class="tdei-button2">Refresh Status</button>
              <button class="tdei-button2">Export Report</button>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<Button className=\\'tdei-button2\\'>Refresh Status</Button>')">Copy JSX</button>
              <code>&lt;Button className="tdei-button2"&gt;<br />&nbsp;&nbsp;Refresh Status<br />&lt;/Button&gt;</code>
            </div>
          </div>

          <!-- Maroon Danger Button -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">.maroon-bg (Danger Action)</span>
              <span style="font-size: 11.5px; color: #c84349; font-weight: 700;">Destructive / Delete</span>
            </div>
            <div class="component-preview-area">
              <button class="maroon-bg">Deactivate Service</button>
              <button class="maroon-bg">Delete Dataset</button>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<Button className=\\'maroon-bg\\'>Deactivate Service</Button>')">Copy JSX</button>
              <code>&lt;Button className="maroon-bg"&gt;<br />&nbsp;&nbsp;Deactivate Service<br />&lt;/Button&gt;</code>
            </div>
          </div>

          <!-- Text Link & Disabled -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">.tdei-primary-link & Disabled State</span>
              <span style="font-size: 11.5px; color: var(--secondary-color);">Links & Disabled</span>
            </div>
            <div class="component-preview-area">
              <a href="#buttons" class="tdei-primary-link">↗ Manage Organization POCs</a>
              <button class="tdei-disabled-btn" disabled>Disabled Action</button>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<Link className=\\'tdei-primary-link\\' to=\\'/\\'>Manage POCs</Link>')">Copy JSX</button>
              <code>&lt;Link className="tdei-primary-link" to="..."&gt;<br />&nbsp;&nbsp;Manage POCs<br />&lt;/Link&gt;</code>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION: BADGES & STATUS TAGS -->
      <section id="badges" class="guide-section">
        <div class="section-header-block">
          <div class="section-title-wrap">
            <h2 class="section-main-title"><span>🏷️</span> Badges, Chips & Status Indicators</h2>
            <div class="section-desc">Job execution status pills, dataset type tags, and role identifier badges.</div>
          </div>
        </div>

        <div class="components-grid">

          <!-- Job Status Chips -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">Job Execution Statuses</span>
            </div>
            <div class="component-preview-area" style="flex-direction: row; flex-wrap: wrap; gap: 10px;">
              <span class="badge-status badge-completed">● Completed</span>
              <span class="badge-status badge-in-progress">● In-Progress</span>
              <span class="badge-status badge-failed">● Failed</span>
              <span class="badge-status badge-abandoned">● Abandoned</span>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<span className=\\'badge-status badge-completed\\'>Completed</span>')">Copy JSX</button>
              <code>&lt;span className="badge-status badge-completed"&gt;Completed&lt;/span&gt;<br />&lt;span className="badge-status badge-in-progress"&gt;In-Progress&lt;/span&gt;</code>
            </div>
          </div>

          <!-- Dataset Types -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">Dataset / Service Types</span>
            </div>
            <div class="component-preview-area" style="flex-direction: row; flex-wrap: wrap; gap: 10px;">
              <span class="badge-status badge-type-osw">OSW</span>
              <span class="badge-status badge-type-pathways">Pathways</span>
              <span class="badge-status badge-type-flex">Flex</span>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<span className=\\'badge-status badge-type-osw\\'>OSW</span>')">Copy JSX</button>
              <code>&lt;span className="badge-status badge-type-osw"&gt;OSW&lt;/span&gt;<br />&lt;span className="badge-status badge-type-pathways"&gt;Pathways&lt;/span&gt;</code>
            </div>
          </div>

          <!-- Roles -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">User Roles</span>
            </div>
            <div class="component-preview-area" style="flex-direction: row; flex-wrap: wrap; gap: 10px;">
              <span class="badge-status badge-role-admin">TDEI Admin</span>
              <span class="badge-status badge-role-poc">Point of Contact (POC)</span>
              <span class="badge-status badge-abandoned">Member</span>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<span className=\\'badge-status badge-role-poc\\'>POC</span>')">Copy JSX</button>
              <code>&lt;span className="badge-status badge-role-admin"&gt;Admin&lt;/span&gt;<br />&lt;span className="badge-status badge-role-poc"&gt;POC&lt;/span&gt;</code>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION: FORM CONTROLS -->
      <section id="forms" class="guide-section">
        <div class="section-header-block">
          <div class="section-title-wrap">
            <h2 class="section-main-title"><span>📋</span> Forms & Input Controls</h2>
            <div class="section-desc">Text inputs, custom purple checkboxes, radio buttons, and required field decorators.</div>
          </div>
        </div>

        <div class="components-grid">
          
          <!-- Text Input & Labels -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">Text Input & Required Indicator</span>
            </div>
            <div class="component-preview-area" style="width: 100%;">
              <div style="width: 100%;">
                <label style="font-size: 14px; font-weight: 600; margin-bottom: 6px; display: block;">
                  Service Name <span style="color: red;">*</span>
                </label>
                <input type="text" class="tdei-input" placeholder="e.g. King County RapidRide G Line" value="Metro Bus Flex Service" />
                <div style="font-size: 12px; color: var(--secondary-color); font-style: italic; margin-top: 4px;">
                  * Enter a descriptive unique name for this service
                </div>
              </div>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<Form.Label>Service Name <span style={{ color: \\'red\\' }}>*</span></Form.Label>\\n<Form.Control className=\\'tdei-input\\' />')">Copy JSX</button>
              <code>&lt;Form.Label&gt;Service Name &lt;span style={{{{ color: 'red' }}}}&gt;*&lt;/span&gt;&lt;/Form.Label&gt;<br />&lt;Form.Control className="tdei-input" /&gt;</code>
            </div>
          </div>

          <!-- Custom Checkboxes & Radio -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">Checkboxes & Radio Options</span>
            </div>
            <div class="component-preview-area" style="gap: 14px;">
              <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer;">
                <input type="checkbox" class="tdei-checkbox" checked />
                <span>Publish dataset immediately upon validation</span>
              </label>

              <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; cursor: pointer;">
                <input type="checkbox" class="tdei-checkbox" />
                <span>Notify point of contact on completion</span>
              </label>

              <div style="display: flex; gap: 20px; margin-top: 4px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer;">
                  <input type="radio" name="jobShow" class="tdei-radio" checked />
                  <span>All Jobs</span>
                </label>
                <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; cursor: pointer;">
                  <input type="radio" name="jobShow" class="tdei-radio" />
                  <span>Submitted by me</span>
                </label>
              </div>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<input type=\\'checkbox\\' className=\\'tdei-checkbox\\' checked />')">Copy JSX</button>
              <code>input[type=checkbox] {{ appearance: none; border: 1.5px solid var(--secondary-color); }}<br />input[type=checkbox]:checked {{ background: var(--primary-color); }}</code>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION: CARDS & CONTAINERS -->
      <section id="containers" class="guide-section">
        <div class="section-header-block">
          <div class="section-title-wrap">
            <h2 class="section-main-title"><span>🃏</span> Cards, Layouts & Tabs</h2>
            <div class="section-desc">Container styles, service row layout with blue accent, KPI summary cards, and tabs.</div>
          </div>
        </div>

        <div class="components-grid">

          <!-- Service Container Card -->
          <div class="component-box" style="grid-column: 1 / -1;">
            <div class="component-box-header">
              <span class="component-box-title">.serviceDetailsContainer (Service Card)</span>
            </div>
            <div class="component-preview-area">
              <div class="serviceDetailsContainer">
                <div style="padding: 16px 20px; display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <span class="badge-status badge-type-osw" style="margin-bottom: 6px;">OSW Dataset Service</span>
                    <div style="font-size: 16px; font-weight: 700; color: #162848;">Seattle Downtown Pedestrian Network</div>
                    <div style="font-size: 13.5px; color: var(--secondary-color); margin-top: 2px;">Provider: SDOT • Version: 2.1.0</div>
                  </div>
                  <div>
                    <button class="tdei-primary-button">View Details</button>
                  </div>
                </div>
                <div class="serviceIdBlock">
                  <span>Service ID: <strong style="font-family: var(--code-font-family); color: #162848;">srv_8923a-f4819-uw</strong></span>
                  <a href="#containers" class="tdei-primary-link">Copy ID</a>
                </div>
              </div>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('.serviceDetailsContainer { border: 1px solid #ddd; box-shadow: 0px 1px 6px #33333314; border-radius: 5px; border-left: 8px solid var(--tdei-blue); }')">Copy CSS</button>
              <code>.serviceDetailsContainer {{ border-left: 8px solid var(--tdei-blue); box-shadow: 0px 1px 6px #33333314; }}</code>
            </div>
          </div>

          <!-- KPI Summary Card -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">KPI Metric Card</span>
            </div>
            <div class="component-preview-area">
              <div class="kpi-card">
                <div class="kpi-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#32006e" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
                <div>
                  <div class="kpi-val">128</div>
                  <div class="kpi-title">Total Processed Datasets</div>
                </div>
              </div>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('<div className=\\'kpi-card\\'>...</div>')">Copy JSX</button>
              <code>&lt;div className="kpi-card"&gt;&lt;div className="kpi-val"&gt;128&lt;/div&gt;...&lt;/div&gt;</code>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <div class="component-box">
            <div class="component-box-header">
              <span class="component-box-title">Navigation Tabs (.nav-tabs)</span>
            </div>
            <div class="component-preview-area" style="width: 100%;">
              <ul class="tdei-nav-tabs">
                <li class="tdei-tab-link active">Active Datasets (24)</li>
                <li class="tdei-tab-link">Drafts (5)</li>
                <li class="tdei-tab-link">Archived (12)</li>
              </ul>
            </div>
            <div class="component-code-area">
              <button class="code-copy-btn" onclick="copySnippet('.nav-tabs .nav-link.active { color: #162848; border-bottom: 4px solid var(--primary-color); }')">Copy CSS</button>
              <code>.nav-tabs .nav-link.active {{ border-bottom: 4px solid var(--primary-color); }}</code>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION: QUICK CHEAT SHEET -->
      <section id="cheatsheet" class="guide-section">
        <div class="section-header-block">
          <div class="section-title-wrap">
            <h2 class="section-main-title"><span>💻</span> Developer Quick Copy Cheat Sheet</h2>
            <div class="section-desc">One-click copy for the full CSS variables block, React import templates, and design token JSON.</div>
          </div>
        </div>

        <h3 class="subsection-title">1. Root CSS Variables</h3>
        <div class="code-export-box">
          <button class="code-copy-btn" onclick="copyCssVariables()">Copy CSS</button>
<pre>:root {
  --primary-font-family: "Open Sans", sans-serif;
  --secondary-font-family: "Montserrat", sans-serif;
  --brand-primary: #32006e;
  --brand-accent: #4b2e83;
  --primary-color: var(--brand-primary);
  --primary-color-dark: var(--brand-primary);
  --secondary-color: #5f647a;
  --tdei-blue: #586AB5;
  --tdei-green: #479FA1;
  --purple-background-light: #f4f0fb;
  --purple-background-dark: #ddd2ee;
  --purple-background-medium: #ebe4f6;
  --white: #ffffff;
}</pre>
        </div>

        <h3 class="subsection-title" style="margin-top: 24px;">2. React Icon Common Imports Boilerplate</h3>
        <div class="code-export-box">
          <button class="code-copy-btn" onclick="copySnippet('import dashboardIcon from \\'../../assets/img/icon-dashboard.svg\\';\\nimport servicesIcon from \\'../../assets/img/icon-services.svg\\';\\nimport datasetsIcon from \\'../../assets/img/icon-datasets.svg\\';\\nimport jobsIcon from \\'../../assets/img/icon-jobs.svg\\';\\nimport membersIcon from \\'../../assets/img/icon-members.svg\\';\\nimport successIcon from \\'../../assets/img/success-icon.svg\\';\\nimport warningIcon from \\'../../assets/img/icon-warning.svg\\';')">Copy Boilerplate</button>
<pre>import dashboardIcon from "../../assets/img/icon-dashboard.svg";
import servicesIcon from "../../assets/img/icon-services.svg";
import datasetsIcon from "../../assets/img/icon-datasets.svg";
import jobsIcon from "../../assets/img/icon-jobs.svg";
import membersIcon from "../../assets/img/icon-members.svg";
import successIcon from "../../assets/img/success-icon.svg";
import warningIcon from "../../assets/img/icon-warning.svg";</pre>
        </div>

      </section>

    </main>
  </div>

  <!-- Toast Alert -->
  <div id="toastNotification" class="toast-notification">
    <span class="toast-check">✓</span>
    <span id="toastMessage">Copied to clipboard!</span>
  </div>

  <!-- Embed JSON Assets Data for JS functions -->
  <script>
    const assetsData = """ + json.dumps(assets_data) + """;
    const colorsData = """ + json.dumps(all_colors) + """;

    let currentCopyMode = 'hex';

    function setCopyMode(mode) {
      currentCopyMode = mode;
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });
      showToast('Copy format set to: ' + mode.toUpperCase());
    }

    function showToast(msg) {
      const toast = document.getElementById('toastNotification');
      const toastMsg = document.getElementById('toastMessage');
      toastMsg.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2400);
    }

    function copyToClipboard(text, alertMsg) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(alertMsg || 'Copied: ' + text);
      }).catch(err => {
        // fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(alertMsg || 'Copied: ' + text);
      });
    }

    function copyColor(hex, varName, rgb) {
      let valToCopy = hex;
      if (currentCopyMode === 'var') valToCopy = `var(${varName})`;
      else if (currentCopyMode === 'rgb') valToCopy = rgb;
      else if (currentCopyMode === 'react') valToCopy = `{ color: '${hex}' }`;
      
      copyToClipboard(valToCopy, `Copied color (${currentCopyMode.toUpperCase()}): ${valToCopy}`);
    }

    function copySnippet(snippet) {
      copyToClipboard(snippet, 'Copied snippet to clipboard');
    }

    function copyIconImport(filename, varName) {
      const imp = `import ${varName} from "../../assets/img/${filename}";`;
      copyToClipboard(imp, `Copied import for ${filename}`);
    }

    function copyIconJsx(varName) {
      const jsx = `<img src={${varName}} alt="" className="iconImg" aria-hidden="true" />`;
      copyToClipboard(jsx, `Copied JSX tag for ${varName}`);
    }

    function copyIconSvgCode(filename) {
      const content = assetsData[filename];
      if (!content) return;
      copyToClipboard(content, `Copied raw code for ${filename}`);
    }

    function copyCssVariables() {
      const css = `:root {
  --primary-font-family: "Open Sans", sans-serif;
  --secondary-font-family: "Montserrat", sans-serif;
  --brand-primary: #32006e;
  --brand-accent: #4b2e83;
  --primary-color: var(--brand-primary);
  --primary-color-dark: var(--brand-primary);
  --secondary-color: #5f647a;
  --tdei-blue: #586AB5;
  --tdei-green: #479FA1;
  --purple-background-light: #f4f0fb;
  --purple-background-dark: #ddd2ee;
  --purple-background-medium: #ebe4f6;
  --white: #ffffff;
}`;
      copyToClipboard(css, 'Copied all :root CSS variables!');
    }

    function exportTokensJson() {
      const tokens = {
        name: "TDEI Brand Design System Tokens",
        version: "1.0.0",
        organization: "Taskar Center at UW",
        colors: colorsData,
        typography: {
          primaryFont: '"Open Sans", sans-serif',
          secondaryFont: '"Montserrat", sans-serif',
          codeFont: '"JetBrains Mono", monospace'
        },
        assetsCount: Object.keys(assetsData).length
      };
      const jsonStr = JSON.stringify(tokens, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tdei-design-tokens.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported tdei-design-tokens.json');
    }

    function setIconPreviewBg(bg) {
      document.querySelectorAll('.icon-preview-box').forEach(box => {
        box.style.backgroundColor = bg;
      });
      showToast('Icon preview background updated');
    }

    function filterIcons(category) {
      document.querySelectorAll('.icon-filter-chip').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.startsWith(category) || (category === 'all' && btn.innerText.startsWith('All')));
      });

      const cards = document.querySelectorAll('.icon-card');
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    // Global Live Search Filter
    const searchInput = document.getElementById('globalSearchInput');
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      // Filter Color Cards
      document.querySelectorAll('.color-card').forEach(card => {
        const searchData = card.dataset.search || '';
        card.style.display = searchData.includes(query) ? 'block' : 'none';
      });

      // Filter Icons
      document.querySelectorAll('.icon-card').forEach(card => {
        const searchData = card.dataset.search || '';
        card.style.display = searchData.includes(query) ? 'flex' : 'none';
      });
    });

    // Keyboard shortcut '/' to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
      }
    });

    // Active navigation scroll spy
    const navLinks = document.querySelectorAll('.nav-item a');
    window.addEventListener('scroll', () => {
      let current = '';
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  </script>
</body>
</html>
"""

# Save to public/styleguide.html and styleguide.html
with open('public/styleguide.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('styleguide.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Successfully generated styleguide.html ({len(html_content)} bytes) into public/styleguide.html and root styleguide.html")
