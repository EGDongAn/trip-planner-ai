/**
 * Google Apps Script for Trip Planner Export
 *
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Copy this code into Code.gs
 * 4. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL to your .env file as NEXT_PUBLIC_APPS_SCRIPT_URL
 */

/**
 * Handle POST requests from the Trip Planner app
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);

    if (requestData.action === 'createTripSheet') {
      const result = createTripSheet(requestData.data);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Unknown action'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Create a new Google Sheet with trip data
 */
function createTripSheet(data) {
  try {
    const { destination, plan, metadata, timeline } = data;

    // Create a new spreadsheet
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HHmmss');
    const spreadsheetName = `${destination} 여행 일정 - ${timestamp}`;
    const ss = SpreadsheetApp.create(spreadsheetName);
    const sheet = ss.getActiveSheet();
    sheet.setName('여행 일정');

    // Set up the header section
    let row = 1;

    // Title
    sheet.getRange(row, 1, 1, 8).merge();
    sheet.getRange(row, 1).setValue(`${destination} 여행 일정`)
      .setFontSize(18)
      .setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('#ffffff');
    row++;

    // Plan name
    sheet.getRange(row, 1, 1, 8).merge();
    sheet.getRange(row, 1).setValue(plan)
      .setFontSize(14)
      .setBackground('#e8f0fe');
    row++;

    // Metadata
    sheet.getRange(row, 1).setValue('출발일:');
    sheet.getRange(row, 2).setValue(metadata.departureDate);
    sheet.getRange(row, 3).setValue('도착일:');
    sheet.getRange(row, 4).setValue(metadata.returnDate);
    sheet.getRange(row, 1, 1, 8).setBackground('#f8f9fa');
    row++;

    sheet.getRange(row, 1).setValue('인원:');
    sheet.getRange(row, 2).setValue(metadata.travelers + '명');
    sheet.getRange(row, 3).setValue('출발지:');
    sheet.getRange(row, 4).setValue(metadata.departureCity);
    sheet.getRange(row, 1, 1, 8).setBackground('#f8f9fa');
    row++;

    if (metadata.budget) {
      sheet.getRange(row, 1).setValue('예산:');
      sheet.getRange(row, 2).setValue(metadata.budget.toLocaleString() + '원');
      sheet.getRange(row, 1, 1, 8).setBackground('#f8f9fa');
      row++;
    }

    // Empty row
    row++;

    // Timeline header
    const headers = ['Day', '날짜', '시간', '활동', '장소', '기간', '카테고리', '비용', '메모', '확인'];
    sheet.getRange(row, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('#ffffff');
    row++;

    // Timeline data
    timeline.forEach(item => {
      const rowData = [
        item.day,
        item.date,
        item.time,
        item.activity,
        item.location,
        item.duration,
        getCategoryLabel(item.category),
        item.cost ? `${item.cost.amount.toLocaleString()} ${item.cost.currency}` : '',
        item.notes || '',
        item.verified ? '✓' : ''
      ];

      sheet.getRange(row, 1, 1, rowData.length).setValues([rowData]);

      // Color code by category
      const categoryColor = getCategoryColor(item.category);
      sheet.getRange(row, 7).setBackground(categoryColor);

      row++;
    });

    // Format the sheet
    sheet.setFrozenRows(row - timeline.length - 1);
    sheet.autoResizeColumns(1, headers.length);

    // Set column widths for better readability
    sheet.setColumnWidth(1, 50);   // Day
    sheet.setColumnWidth(2, 100);  // Date
    sheet.setColumnWidth(3, 80);   // Time
    sheet.setColumnWidth(4, 250);  // Activity
    sheet.setColumnWidth(5, 200);  // Location
    sheet.setColumnWidth(6, 80);   // Duration
    sheet.setColumnWidth(7, 100);  // Category
    sheet.setColumnWidth(8, 100);  // Cost
    sheet.setColumnWidth(9, 200);  // Notes
    sheet.setColumnWidth(10, 60);  // Verified

    // Return success with spreadsheet URL
    return {
      success: true,
      spreadsheetUrl: ss.getUrl(),
      spreadsheetId: ss.getId()
    };

  } catch (error) {
    Logger.log('Error creating sheet: ' + error.toString());
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get Korean label for category
 */
function getCategoryLabel(category) {
  const labels = {
    'transport': '이동',
    'activity': '활동',
    'food': '식사',
    'accommodation': '숙소',
    'free': '자유시간'
  };
  return labels[category] || category;
}

/**
 * Get color for category
 */
function getCategoryColor(category) {
  const colors = {
    'transport': '#cfe2ff',
    'activity': '#d1e7dd',
    'food': '#fff3cd',
    'accommodation': '#e2d9f3',
    'free': '#e2e3e5'
  };
  return colors[category] || '#ffffff';
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Trip Planner Apps Script is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
