import { useState, useEffect } from 'react';
import axe from 'axe-core';
import html2pdf from 'html2pdf.js';

interface AccessibilityIssue {
  id: string;
  impact: string;
  description: string;
  element: string;
  help: string;
  helpUrl: string;
  tags: string[];
}

interface ColorSuggestion {
  element: string;
  currentColor: string;
  suggestedColor: string;
  contrastRatio: number;
}

export function useAccessibilityChecker() {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [colorSuggestions, setColorSuggestions] = useState<ColorSuggestion[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanPage = async () => {
    setIsScanning(true);
    try {
      const results = await axe.run(document, {
        rules: {
          'color-contrast': { enabled: true },
          'aria-required-attr': { enabled: true },
          'aria-roles': { enabled: true },
          'html-has-lang': { enabled: true },
          'image-alt': { enabled: true },
          'label': { enabled: true },
          'link-name': { enabled: true },
        }
      });

      const accessibilityIssues = results.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        element: violation.nodes[0]?.target[0] || '',
        help: violation.help,
        helpUrl: violation.helpUrl,
        tags: violation.tags,
      }));

      setIssues(accessibilityIssues);

      // Generate color suggestions for contrast issues
      const contrastIssues = accessibilityIssues.filter(issue => 
        issue.tags.includes('color-contrast')
      );

      const suggestions = contrastIssues.map(issue => {
        const element = document.querySelector(issue.element);
        if (!element) return null;

        const styles = window.getComputedStyle(element);
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;

        // Calculate suggested colors
        const suggestedColor = calculateSuggestedColor(color, backgroundColor);
        const contrastRatio = calculateContrastRatio(color, backgroundColor);

        return {
          element: issue.element,
          currentColor: color,
          suggestedColor,
          contrastRatio,
        };
      }).filter(Boolean) as ColorSuggestion[];

      setColorSuggestions(suggestions);
    } catch (error) {
      console.error('Error scanning for accessibility issues:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const generateReport = async () => {
    const reportContent = document.createElement('div');
    reportContent.innerHTML = `
      <h1>Accessibility Report</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      
      <h2>Issues Found: ${issues.length}</h2>
      ${issues.map(issue => `
        <div style="margin-bottom: 20px;">
          <h3>${issue.description}</h3>
          <p><strong>Impact:</strong> ${issue.impact}</p>
          <p><strong>Element:</strong> ${issue.element}</p>
          <p><strong>Help:</strong> ${issue.help}</p>
          <p><strong>More Info:</strong> <a href="${issue.helpUrl}">${issue.helpUrl}</a></p>
        </div>
      `).join('')}
      
      <h2>Color Contrast Suggestions</h2>
      ${colorSuggestions.map(suggestion => `
        <div style="margin-bottom: 20px;">
          <p><strong>Element:</strong> ${suggestion.element}</p>
          <p><strong>Current Color:</strong> ${suggestion.currentColor}</p>
          <p><strong>Suggested Color:</strong> ${suggestion.suggestedColor}</p>
          <p><strong>Current Contrast Ratio:</strong> ${suggestion.contrastRatio}</p>
        </div>
      `).join('')}
    `;

    const opt = {
      margin: 1,
      filename: 'accessibility-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(reportContent).save();
  };

  // Run initial scan when component mounts
  useEffect(() => {
    scanPage();
  }, []);

  return {
    issues,
    colorSuggestions,
    isScanning,
    scanPage,
    generateReport,
  };
}

// Helper functions for color calculations
function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = parseRGB(color1);
  const rgb2 = parseRGB(color2);
  
  const l1 = calculateRelativeLuminance(rgb1);
  const l2 = calculateRelativeLuminance(rgb2);
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

function calculateSuggestedColor(foreground: string, background: string): string {
  const rgb = parseRGB(foreground);
  let adjustedRGB = { ...rgb };
  
  while (calculateContrastRatio(rgbToString(adjustedRGB), background) < 4.5) {
    if (calculateRelativeLuminance(adjustedRGB) < 0.5) {
      // Make color lighter
      adjustedRGB = {
        r: Math.min(255, adjustedRGB.r + 10),
        g: Math.min(255, adjustedRGB.g + 10),
        b: Math.min(255, adjustedRGB.b + 10),
      };
    } else {
      // Make color darker
      adjustedRGB = {
        r: Math.max(0, adjustedRGB.r - 10),
        g: Math.max(0, adjustedRGB.g - 10),
        b: Math.max(0, adjustedRGB.b - 10),
      };
    }
  }
  
  return rgbToString(adjustedRGB);
}

function parseRGB(color: string) {
  const match = color.match(/\d+/g);
  return {
    r: parseInt(match?.[0] || '0'),
    g: parseInt(match?.[1] || '0'),
    b: parseInt(match?.[2] || '0'),
  };
}

function calculateRelativeLuminance(rgb: { r: number, g: number, b: number }) {
  const sRGB = {
    r: rgb.r / 255,
    g: rgb.g / 255,
    b: rgb.b / 255,
  };
  
  const rgb2 = {
    r: sRGB.r <= 0.03928 ? sRGB.r / 12.92 : Math.pow((sRGB.r + 0.055) / 1.055, 2.4),
    g: sRGB.g <= 0.03928 ? sRGB.g / 12.92 : Math.pow((sRGB.g + 0.055) / 1.055, 2.4),
    b: sRGB.b <= 0.03928 ? sRGB.b / 12.92 : Math.pow((sRGB.b + 0.055) / 1.055, 2.4),
  };
  
  return 0.2126 * rgb2.r + 0.7152 * rgb2.g + 0.0722 * rgb2.b;
}

function rgbToString(rgb: { r: number, g: number, b: number }) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}