import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TimelineRow, TripMetadata } from '@/types/trip';

export interface PdfExportOptions {
  destination: string;
  plan: string;
  timeline: TimelineRow[];
  metadata: TripMetadata;
  filename?: string;
}

/**
 * Export timeline to PDF
 *
 * @param options - Export options including timeline data and metadata
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export async function exportToPdf(options: PdfExportOptions): Promise<void> {
  const { destination, plan, timeline, metadata, filename } = options;

  // Create a temporary container for rendering
  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    width: 800px;
    background: white;
    padding: 40px;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  document.body.appendChild(container);

  // Build HTML content
  container.innerHTML = `
    <div style="color: #1e293b;">
      <div style="margin-bottom: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px;">
        <h1 style="font-size: 28px; font-weight: bold; margin: 0 0 10px 0; color: #1e293b;">
          ${destination} 여행 일정
        </h1>
        <p style="font-size: 16px; color: #64748b; margin: 5px 0;">
          ${plan}
        </p>
        <div style="margin-top: 15px; font-size: 14px; color: #64748b;">
          <p style="margin: 3px 0;">출발: ${metadata.departureDate} | 도착: ${metadata.returnDate}</p>
          <p style="margin: 3px 0;">인원: ${metadata.travelers}명 | 출발지: ${metadata.departureCity}</p>
          ${metadata.budget ? `<p style="margin: 3px 0;">예산: ${metadata.budget.toLocaleString()}원</p>` : ''}
        </div>
      </div>

      ${generateTimelineHtml(timeline)}
    </div>
  `;

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download PDF
    const pdfFilename = filename || `${destination}_trip_${new Date().getTime()}.pdf`;
    pdf.save(pdfFilename);
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

/**
 * Generate HTML for timeline rows
 */
function generateTimelineHtml(timeline: TimelineRow[]): string {
  const groupedByDay = timeline.reduce((acc, row) => {
    if (!acc[row.day]) {
      acc[row.day] = [];
    }
    acc[row.day].push(row);
    return acc;
  }, {} as Record<number, TimelineRow[]>);

  return Object.entries(groupedByDay)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([day, rows]) => {
      const firstRow = rows[0];
      return `
        <div style="margin-bottom: 25px; page-break-inside: avoid;">
          <div style="background: #f1f5f9; padding: 12px 15px; border-radius: 8px; margin-bottom: 15px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="background: #3b82f6; color: white; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
                ${day}
              </div>
              <span style="font-size: 16px; font-weight: 600; color: #1e293b;">
                ${new Date(firstRow.date).toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </span>
            </div>
          </div>

          <div style="margin-left: 20px;">
            ${rows.map(row => `
              <div style="margin-bottom: 12px; padding: 12px; background: #f8fafc; border-left: 3px solid ${getCategoryColor(row.category)}; border-radius: 4px;">
                <div style="display: flex; gap: 15px; align-items: flex-start;">
                  <span style="font-size: 13px; font-weight: 500; color: #64748b; min-width: 60px;">
                    ${row.time}
                  </span>
                  <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 600; color: #1e293b; margin-bottom: 4px;">
                      ${row.activity}
                    </div>
                    <div style="font-size: 13px; color: #64748b;">
                      📍 ${row.location}
                    </div>
                    ${row.notes ? `<div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">💬 ${row.notes}</div>` : ''}
                  </div>
                  ${row.cost ? `
                    <div style="font-size: 13px; color: #1e293b; font-weight: 500;">
                      ${row.cost.amount.toLocaleString()} ${row.cost.currency}
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Get color for category
 */
function getCategoryColor(category: TimelineRow['category']): string {
  const colors = {
    transport: '#3b82f6',
    activity: '#10b981',
    food: '#f59e0b',
    accommodation: '#8b5cf6',
    free: '#6b7280'
  };
  return colors[category] || '#6b7280';
}
