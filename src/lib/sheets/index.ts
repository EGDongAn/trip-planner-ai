/**
 * Google Sheets integration for Trip Planner
 *
 * This module provides utilities for exporting trip data to Google Sheets
 * via Apps Script Web App
 */

export { exportToSheet, isAppsScriptConfigured } from './appsScriptClient';
export type { SheetExportData, SheetExportResponse } from './appsScriptClient';
