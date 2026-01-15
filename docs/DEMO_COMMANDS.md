# Soranauts Monorepo - Demo Commands

## 🚀 **Quick Start**
```bash
# Navigate to the project
cd /Users/dustinmatlock/Documents/GitHub/soranauts

# Start the development server
pnpm dev
```

## 📊 **Verify Functionality**

### **1. Check Glossary Data**
```bash
# Verify all 58 terms are loaded
curl -s http://localhost:4321/glossary.json | grep -o '"totalCount": [0-9]*'
# Expected output: "totalCount": 58
```

### **2. Test Glossary Page**
```bash
# Check glossary page loads correctly
curl -s http://localhost:4321/glossary | grep -i "SORA Glossary"
# Expected: Page title and metadata
```

### **3. Test Quote Tool**
```bash
# Check quote tool page loads
curl -s http://localhost:4321/tools/quote | grep -i "Quote Tool"
# Expected: Page title and metadata
```

### **4. Verify API Endpoint**
```bash
# Test the quote API (will fail without real API, but should return proper error)
curl -s "http://localhost:4321/api/quote?a=XOR&b=KUSD&amount=100" | head -3
# Expected: JSON response (success or error)
```

## 🎯 **Key URLs to Test**
- **Glossary**: http://localhost:4321/glossary
- **Quote Tool**: http://localhost:4321/tools/quote
- **Glossary JSON**: http://localhost:4321/glossary.json
- **API Quote**: http://localhost:4321/api/quote?a=XOR&b=KUSD&amount=100

## 📁 **Project Structure**
```
soranauts/
├── apps/web/                    # Main Astro application
│   ├── src/
│   │   ├── components/
│   │   │   ├── glossary/        # Interactive glossary app
│   │   │   └── tools/          # Quote tool
│   │   ├── pages/
│   │   │   ├── api/            # API endpoints
│   │   │   └── tools/          # Tool pages
│   │   └── server/             # Server-side utilities
│   ├── public/
│   │   └── glossary.json       # Generated glossary data (58 terms)
│   └── scripts/
│       └── indexGlossary.ts  # Typesense indexing script
├── packages/
│   ├── chain/                  # Blockchain facade
│   ├── config/                 # Shared configuration
│   └── ui/                     # Shared UI components
└── package.json               # Root workspace configuration
```

## ✅ **What's Working**
1. **Full Glossary**: 58 terms with search, filtering, categories
2. **Interactive Features**: Live search, keyboard navigation, deep linking
3. **Quote Tool**: Token swapping interface with API integration
4. **Monorepo**: Clean architecture with pnpm workspaces
5. **TypeScript**: Strict mode across all packages
6. **Build System**: Automated glossary generation and optimization

## 🎉 **Success Indicators**
- ✅ Server starts without errors
- ✅ All pages load correctly
- ✅ Glossary shows 58 terms (not just 2)
- ✅ Search and filtering work in real-time
- ✅ No QueryClient errors in console
- ✅ Responsive design on all screen sizes
- ✅ Full accessibility support