import type { DaySchedule } from "@/components/trip/TimelineDisplay";
import type { TimelineRow } from "@/types/trip";

interface ExportLocation {
  name: string;
  description: string;
  date: string;
  time: string;
  day: number;
  category: string;
  lat?: number;
  lng?: number;
}

/**
 * Convert DaySchedule to exportable locations
 */
function scheduleToLocations(schedule: DaySchedule[]): ExportLocation[] {
  const locations: ExportLocation[] = [];

  for (const day of schedule) {
    for (const item of day.items) {
      locations.push({
        name: item.activity,
        description: `${item.location}${item.cost ? ` - ${item.cost.currency}${item.cost.amount}` : ''}`,
        date: day.date,
        time: item.time,
        day: day.dayNumber,
        category: item.category,
      });
    }
  }

  return locations;
}

/**
 * Convert TimelineRow array to exportable locations (with coordinates)
 */
function timelineToLocations(timeline: TimelineRow[]): ExportLocation[] {
  return timeline.map((row) => ({
    name: row.activity,
    description: `${row.location}${row.notes ? ` - ${row.notes}` : ''}`,
    date: row.date,
    time: row.time,
    day: row.day,
    category: row.category,
    lat: row.coordinates?.lat,
    lng: row.coordinates?.lng,
  }));
}

/**
 * Generate CSV content for Google My Maps
 * Format: Name, Description, Day, Date, Time, Category, Latitude, Longitude
 */
export function generateCSV(schedule: DaySchedule[], timeline?: TimelineRow[]): string {
  const locations = timeline ? timelineToLocations(timeline) : scheduleToLocations(schedule);

  const headers = ['Name', 'Description', 'Day', 'Date', 'Time', 'Category', 'Latitude', 'Longitude'];

  const rows = locations.map((loc) => [
    `"${loc.name.replace(/"/g, '""')}"`,
    `"${loc.description.replace(/"/g, '""')}"`,
    loc.day.toString(),
    loc.date,
    loc.time,
    loc.category,
    loc.lat?.toString() || '',
    loc.lng?.toString() || '',
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Generate KML content for Google My Maps
 */
export function generateKML(
  schedule: DaySchedule[],
  timeline?: TimelineRow[],
  tripName: string = 'My Trip'
): string {
  const locations = timeline ? timelineToLocations(timeline) : scheduleToLocations(schedule);

  const categoryStyles: Record<string, { color: string; icon: string }> = {
    transport: { color: 'ff4285f4', icon: 'http://maps.google.com/mapfiles/kml/shapes/airports.png' },
    food: { color: 'ffff9800', icon: 'http://maps.google.com/mapfiles/kml/shapes/dining.png' },
    activity: { color: 'ff4caf50', icon: 'http://maps.google.com/mapfiles/kml/shapes/flag.png' },
    accommodation: { color: 'ff9c27b0', icon: 'http://maps.google.com/mapfiles/kml/shapes/lodging.png' },
    shopping: { color: 'ffe91e63', icon: 'http://maps.google.com/mapfiles/kml/shapes/shopping.png' },
    entertainment: { color: 'ffffeb3b', icon: 'http://maps.google.com/mapfiles/kml/shapes/star.png' },
    free: { color: 'ff607d8b', icon: 'http://maps.google.com/mapfiles/kml/shapes/info.png' },
  };

  // Group by day for folders
  const dayGroups = new Map<number, ExportLocation[]>();
  for (const loc of locations) {
    if (!dayGroups.has(loc.day)) {
      dayGroups.set(loc.day, []);
    }
    dayGroups.get(loc.day)!.push(loc);
  }

  const placemarks = Array.from(dayGroups.entries())
    .sort(([a], [b]) => a - b)
    .map(([day, locs]) => {
      const dayPlacemarks = locs.map((loc) => {
        const style = categoryStyles[loc.category] || categoryStyles.activity;
        const hasCoords = loc.lat !== undefined && loc.lng !== undefined;

        return `
      <Placemark>
        <name>${escapeXml(loc.name)}</name>
        <description><![CDATA[
          <b>Day ${loc.day}</b> - ${loc.date}<br/>
          <b>Time:</b> ${loc.time}<br/>
          <b>Location:</b> ${escapeXml(loc.description)}<br/>
          <b>Category:</b> ${loc.category}
        ]]></description>
        <Style>
          <IconStyle>
            <color>${style.color}</color>
            <scale>1.2</scale>
            <Icon><href>${style.icon}</href></Icon>
          </IconStyle>
        </Style>
        ${hasCoords ? `<Point><coordinates>${loc.lng},${loc.lat},0</coordinates></Point>` : ''}
      </Placemark>`;
      }).join('');

      return `
    <Folder>
      <name>Day ${day}</name>
      ${dayPlacemarks}
    </Folder>`;
    }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(tripName)}</name>
    <description>Trip itinerary exported from Trip Planner AI</description>
    ${placemarks}
  </Document>
</kml>`;
}

/**
 * Escape special XML characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download schedule as CSV
 */
export function downloadCSV(
  schedule: DaySchedule[],
  timeline?: TimelineRow[],
  filename: string = 'trip-itinerary.csv'
): void {
  const csv = generateCSV(schedule, timeline);
  downloadFile(csv, filename, 'text/csv;charset=utf-8');
}

/**
 * Download schedule as KML
 */
export function downloadKML(
  schedule: DaySchedule[],
  timeline?: TimelineRow[],
  tripName: string = 'My Trip',
  filename: string = 'trip-itinerary.kml'
): void {
  const kml = generateKML(schedule, timeline, tripName);
  downloadFile(kml, filename, 'application/vnd.google-earth.kml+xml');
}
