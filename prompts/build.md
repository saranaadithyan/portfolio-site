# Portfolio Revamp Prompt

Build a complete portfolio website by migrating my existing React portfolio to **Next.js 15 (App Router)** using **TypeScript**, **Tailwind CSS**, and **Framer Motion** while preserving the overall content flow and branding of my existing portfolio. The goal is **not to redesign from scratch**, but to modernize the application with a cleaner architecture, improved responsiveness, better SEO, maintainability, accessibility, and performance.

Use my existing portfolio as the primary reference for the overall layout, navigation flow, design language, and branding. Build the project as a reusable boilerplate with placeholder content and reusable components, allowing me to populate each section with actual content at a later stage. Focus on establishing the complete structure, styling, responsiveness, and architecture rather than migrating the existing content.

## Reference Site

https://saran-aadithyan-portfolio.netlify.app/

## Technology Stack

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* Framer Motion
* next/image
* next/font/google
* ESLint & Prettier

## Typography

Use **Electrolize** as the global font for the entire application.

```tsx
import { Electrolize } from "next/font/google";

export const electrolize = Electrolize({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-electrolize",
});
```

Configure it globally using Next.js font optimization instead of importing from Google Fonts through CSS.

## Design Philosophy

The website should have a **minimal, modern, developer-focused** appearance.

Prioritize:

* Clean layouts
* Consistent spacing
* Flat UI
* Thin borders
* Subtle hover animations
* Component reusability
* Responsive design
* Excellent readability
* Maintainable architecture

Avoid excessive gradients, heavy shadows, flashy animations, or inconsistent styling.

## Color Palette

Background: `#D4D6D4`

Surface: `#FFFFFF`

Card Background: `#F8F8F8`

Border: `#27272A`

Primary: `#333333`

Heading Text: `#282929`

Body Text: `#444444`

Muted Text: `#7C7D80`

Hover Background: `#ECECEC`

Shadow:

```css
rgba(0,0,0,0.06)
```

The overall design should rely more on spacing and borders than shadows.

---

# Navigation

Create a sticky responsive navigation bar containing:

* Home
* About
* Projects
* Blogs
* Certifications
* Contact

Navigation Requirements

* Sticky
* Active section highlighting
* Smooth scrolling
* Mobile hamburger menu
* Transparent initially
* Slight background blur while scrolling
* Contact should open a modal instead of navigating to another section

---

# Website Flow

Maintain the following content order.

Hero

────────────────────────

About

────────────────────────

Skills

────────────────────────

Portfolio Projects

────────────────────────

Blogs

────────────────────────

Certificates

────────────────────────

Footer

Every section should be separated using subtle borders instead of excessive whitespace.

Use a reusable Section component.

---

# Hero Section

Include

* Name
* Professional title
* Short introduction
* View Projects button
* Download Resume button

Enhancements

* Animated role/title
* Smooth fade animations
* Scroll indicator
* Minimal background decoration

---

# About Section

Two-column responsive layout.

Include

* Profile image
* Professional summary
* Experience
* Current role
* Core technologies
* Personal interests

---

# Skills Section

Display categorized skill cards.

Example

Frontend

React

Next.js

TypeScript

Tailwind CSS

Backend

Node.js

Express

Cloud

Oracle Cloud Infrastructure

Docker

GitHub Actions

The layout should adapt naturally across desktop, tablet, and mobile devices.

---

# Portfolio Projects

Project cards should display

* Project image
* Title
* Description
* Technologies
* GitHub link
* Live Demo
* Status
* Tags

Responsive Grid

Desktop

3 Columns

Tablet

2 Columns

Mobile

1 Column

---

# Blogs

Each blog card should contain

* Cover image
* Category
* Published date
* Reading time
* Title
* Summary
* Read More button

If no blogs exist, show a professional placeholder instead of removing the section.

---

# Certificates

Each certificate card should contain

* Certificate image
* Organization
* Certificate title
* Completion date
* Credential link

---

# Contact

Do NOT create a separate contact section.

Instead,

Clicking **Contact** in the navigation should open a modal.

The modal should contain

* Name
* Email
* Subject
* Message
* Send button

Also display

* Email
* GitHub
* LinkedIn

Modal Features

* Background blur
* ESC key support
* Click outside to close
* Keyboard accessible
* Fully responsive

---

# Footer

Include

* Name
* Quick Links
* Social Links
* Copyright
* Built with Next.js & Tailwind CSS

---

# Responsive Design

The application must follow a mobile-first approach.

Desktop

* Spacious layouts
* Multi-column grids

Laptop

* Slightly condensed spacing

Tablet

* Adaptive layouts
* Hamburger navigation

Mobile

* Single-column layouts
* Larger touch targets
* Optimized typography
* No horizontal scrolling

The UI should feel consistent on every screen size.

---

# Reusable Component Architecture

Build the project using reusable UI components rather than section-specific styles.

Suggested folder structure

```text
src/app/

src/components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Container.tsx
│   ├── Divider.tsx
│   ├── Heading.tsx
│   ├── Modal.tsx
│   └── Section.tsx
│
├── layout/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── ContactModal.tsx
│
└── sections/
    ├── Hero.tsx
    ├── About.tsx
    ├── Skills.tsx
    ├── Projects.tsx
    ├── Blogs.tsx
    └── Certificates.tsx

data/
public/
```

---

# Universal Card Component

Create a single reusable `Card` component to maintain consistent styling across Projects, Blogs, Skills, and Certificates.

Example

```tsx
<Card>
    <CardHeader />
    <CardContent />
    <CardFooter />
</Card>
```

Base Card Styling

* Rounded corners
* Thin border
* Shared padding
* Shared hover effect
* Shared transition
* Shared spacing

Recommended Tailwind styles

```text
rounded-xl
border border-[#27272A]/15
bg-[#F8F8F8]
p-6
transition-all
duration-300
hover:-translate-y-1
hover:shadow-md
```

Support layout variants through props rather than duplicating CSS.

Example

```tsx
<Card variant="project" />

<Card variant="blog" />

<Card variant="certificate" />

<Card variant="skill" />
```

Only the internal layout should change; the visual styling must remain identical.

---

# Shared UI Components

Create reusable components for

* Button
* Card
* Badge
* Modal
* Section
* Container
* Divider
* Heading
* IconButton

Every section should be built using these primitives to ensure future scalability.

---

# Animations

Use Framer Motion sparingly.

Include

* Fade-up on scroll
* Hover lift for cards
* Smooth button interactions
* Contact modal animation
* Smooth mobile navigation

Animations should enhance usability without becoming distracting.

---

# Performance & SEO

Implement

* Server-side rendering and static generation where appropriate
* next/image optimization
* next/font optimization
* Dynamic metadata
* Open Graph tags
* Twitter Card metadata
* JSON-LD structured data
* XML Sitemap
* robots.txt
* Semantic HTML
* ARIA labels
* Keyboard accessibility
* High Lighthouse scores (90–100)

---

# Code Quality

* Strict TypeScript
* Clean folder structure
* Reusable components
* Avoid duplicated code
* Consistent naming conventions
* Component-driven architecture
* Well-commented code where necessary
* Maintainable and scalable structure

---

# Final Goal

The finished portfolio should feel like a premium, production-ready developer portfolio that reflects modern engineering practices. It should preserve the recognizable content flow of my existing website while introducing a refined visual language, consistent reusable components, excellent responsiveness, and an optimized Next.js architecture. Every visual element should derive from reusable design primitives, making future enhancements simple, consistent, and maintainable without requiring duplicated styles or structural changes.
