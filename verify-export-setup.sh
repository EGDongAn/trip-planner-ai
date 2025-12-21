#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Trip Planner Export Services - Verification Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Node modules
echo "📦 Checking dependencies..."
if npm list jspdf html2canvas lucide-react > /dev/null 2>&1; then
    echo "✅ All required packages are installed"
else
    echo "❌ Some packages are missing"
    echo "   Run: npm install"
fi
echo ""

# Check source files
echo "📄 Checking source files..."
files=(
    "src/lib/sheets/appsScriptClient.ts"
    "src/lib/sheets/index.ts"
    "src/lib/export/pdfService.ts"
    "src/lib/export/imageService.ts"
    "src/lib/export/index.ts"
    "src/components/trip/ExportButtons.tsx"
    "src/app/api/sheets/export/route.ts"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        all_exist=false
    fi
done
echo ""

# Check documentation
echo "📖 Checking documentation..."
docs=(
    "EXPORT_SETUP.md"
    "INTEGRATION_GUIDE.md"
    "USAGE_EXAMPLE.md"
    "scripts/AppsScript.gs"
    ".env.example"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "✅ $doc"
    else
        echo "❌ $doc (missing)"
    fi
done
echo ""

# Check environment variables
echo "🔧 Checking environment configuration..."
if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_APPS_SCRIPT_URL" .env.local; then
        echo "✅ Apps Script URL is configured"
    else
        echo "⚠️  Apps Script URL not found in .env.local"
        echo "   Google Sheets export will not work until configured"
    fi
else
    echo "⚠️  .env.local not found"
    echo "   Copy .env.example to .env.local and configure"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$all_exist" = true ]; then
    echo "✅ All core files are present"
    echo ""
    echo "Next steps:"
    echo "1. Set up Google Apps Script (see EXPORT_SETUP.md)"
    echo "2. Add ExportButtons to your trip page (see INTEGRATION_GUIDE.md)"
    echo "3. Test each export format"
else
    echo "❌ Some files are missing"
    echo "   Please ensure all export services are properly created"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
