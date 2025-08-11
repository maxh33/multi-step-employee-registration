# Design Reference - Multi-Step Employee Registration

## Figma Design Source

**Main Prototype**: https://www.figma.com/proto/r7xOsboMOQlMpEx8D5kH3a/Desafio-Flugo?node-id=2101-9297&t=ZcgP4ZVsOtCzzCIN-1

## Design Specifications to Extract

*Note: This document serves as a template for documenting design specifications once the Figma design is accessible or design images are provided.*

### Color Palette

```css
/* Primary Colors */
--primary-main: #00C851
--primary-light: #33D677
--primary-dark: #00A043

/* Secondary Colors */
--secondary-main: #6c757d
--secondary-light: #adb5bd
--secondary-dark: #495057

/* Neutral Colors */
--background-default: #ffffff
--background-paper: #ffffff
--text-primary: #212529
--text-secondary: #6c757d

/* Status Colors */
--success-main: #00C851
--error-main: #dc3545
--warning-main: #ffc107
--info-main: #17a2b8
```

### Typography Scale

```css
/* Font Families */
--font-family-primary: '[extract from Figma]';
--font-family-secondary: '[extract from Figma]';

/* Font Sizes */
--text-h1: [size]px; /* Main headings */
--text-h2: [size]px; /* Section headings */
--text-h3: [size]px; /* Step titles */
--text-body1: [size]px; /* Form labels */
--text-body2: [size]px; /* Help text */
--text-caption: [size]px; /* Small text */
--text-button: [size]px; /* Button text */

/* Font Weights */
--weight-light: 300;
--weight-regular: 400;
--weight-medium: 500;
--weight-bold: 700;
```

### Spacing System

```css
/* Base spacing unit */
--spacing-unit: [extract from Figma]px;

/* Spacing scale */
--spacing-xs: calc(var(--spacing-unit) * 0.5);
--spacing-sm: var(--spacing-unit);
--spacing-md: calc(var(--spacing-unit) * 1.5);
--spacing-lg: calc(var(--spacing-unit) * 2);
--spacing-xl: calc(var(--spacing-unit) * 3);
--spacing-xxl: calc(var(--spacing-unit) * 4);

/* Component spacing */
--form-step-spacing: [extract from Figma]px;
--field-spacing: [extract from Figma]px;
--button-spacing: [extract from Figma]px;
```

### Component Specifications

#### Step Indicator
- **Layout**: Horizontal layout with progress bar
- **Active Step Style**: Green circle (#00C851) with white number, 40px diameter
- **Completed Step Style**: Green circle with white checkmark icon
- **Inactive Step Style**: Light gray circle (#e9ecef) with gray number
- **Connector Style**: Progress bar background #e9ecef, active green #00C851

#### Form Fields
- **Input Height**: 56px
- **Border Radius**: 8px
- **Border Width**: 1px
- **Focus State**: Green border (#00C851), subtle shadow
- **Error State**: Red border (#dc3545) with error message
- **Label Style**: Top positioned, 14px, #212529
- **Placeholder Style**: #6c757d, regular weight

#### Buttons
- **Primary Button**:
  - Background: #00C851
  - Text Color: #ffffff
  - Border Radius: 8px
  - Padding: 14px 32px
  - Height: 48px
  - Font Weight: 500
  - Hover State: Darker green #00A043

- **Secondary Button**:
  - Background: transparent
  - Text Color: #6c757d
  - Border: 1px solid #dee2e6
  - Border Radius: 8px
  - Padding: 14px 32px
  - Height: 48px
  - Hover State: Light gray background #f8f9fa

#### Cards/Containers
- **Form Container**:
  - Background: [color from Figma]
  - Border Radius: [value]px
  - Shadow: [box-shadow values]
  - Padding: [values from Figma]
  - Max Width: [value]px

- **Step Card**:
  - Background: [color from Figma]
  - Border: [specifications]
  - Spacing: [internal padding/margins]

### Layout Specifications

#### Breakpoints
```css
/* Mobile First Approach */
--breakpoint-xs: 0px;
--breakpoint-sm: 600px;
--breakpoint-md: 900px;
--breakpoint-lg: 1200px;
--breakpoint-xl: 1536px;
```

#### Grid System
- **Container Max Width**: [extract from Figma]
- **Grid Columns**: [number of columns at different breakpoints]
- **Gutter Width**: [spacing between columns]

#### Form Layout
- **Single Column**: [specifications for mobile]
- **Two Column**: [specifications for desktop]
- **Field Widths**: [full-width, half-width specifications]

### Interactive States

#### Form Fields
- **Default**: [border, background, text colors]
- **Focus**: [border highlight, shadow, transition]
- **Filled**: [styling when field has content]
- **Error**: [border color, background, icon, message styling]
- **Disabled**: [opacity, cursor, background changes]

#### Buttons
- **Default**: [base styling]
- **Hover**: [background/shadow changes]
- **Active**: [pressed state styling]
- **Loading**: [spinner/disabled state]
- **Disabled**: [opacity, cursor changes]

#### Step Navigation
- **Next Button States**: [enabled/disabled based on validation]
- **Back Button States**: [always enabled except first step]
- **Submit Button States**: [loading state during submission]

### Animation Specifications

#### Transitions
- **Step Changes**: [fade/slide transition duration and easing]
- **Field Focus**: [transition timing for focus states]
- **Button Hover**: [hover transition duration]
- **Form Validation**: [error message animation]

#### Loading States
- **Form Submission**: [loading spinner/skeleton specifications]
- **Field Validation**: [inline loading indicators]
- **Step Transition**: [loading between steps if applicable]

### Accessibility Specifications

#### Color Contrast
- **Text on Background**: [ensure WCAG AA compliance]
- **Button Text**: [ensure sufficient contrast]
- **Error States**: [ensure error text is readable]

#### Focus Indicators
- **Focus Ring**: [color, width, style for keyboard navigation]
- **Focus Order**: [logical tab order through form]

## Implementation Notes

### Material UI Theme Override
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '[primary color from Figma]',
      light: '[light variant]',
      dark: '[dark variant]',
    },
    secondary: {
      main: '[secondary color from Figma]',
      // ... other color specifications
    },
  },
  typography: {
    fontFamily: '[font family from Figma]',
    h1: {
      fontSize: '[size from Figma]',
      fontWeight: '[weight from Figma]',
    },
    // ... other typography specifications
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // Custom styling to match Figma
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Custom styling to match Figma
        },
      },
    },
  },
});
```

### Custom CSS Variables
```css
:root {
  /* Extract all custom properties from Figma design */
  --form-max-width: [value]px;
  --step-indicator-size: [value]px;
  --field-border-radius: [value]px;
  /* ... other design tokens */
}
```

## Design Asset Requirements

### Images Needed from Figma
- [ ] Step indicator icons (active, completed, inactive states)
- [ ] Form field icons (if any)
- [ ] Loading spinner design
- [ ] Logo/branding elements
- [ ] Success/error state icons

### Export Specifications
- **Format**: SVG for icons, PNG for complex images
- **Resolutions**: 1x, 2x, 3x for different screen densities
- **Color Variants**: Light/dark theme versions if applicable

## Responsive Behavior

### Mobile (320px - 599px)
- [Extract mobile-specific layout specifications]
- [Form field stacking behavior]
- [Button sizing and placement]
- [Typography adjustments]

### Tablet (600px - 899px)
- [Extract tablet-specific specifications]
- [Layout transitions from mobile]

### Desktop (900px+)
- [Extract desktop specifications]
- [Multi-column layout if applicable]
- [Hover states and interactions]

---

**Action Required**: 
1. Access Figma design file to extract exact specifications
2. Replace placeholder values with actual design values
3. Export required design assets
4. Create component-specific design documentation