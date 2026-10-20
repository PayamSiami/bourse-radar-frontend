#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔍 SEO Audit for Bourse Radar');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const errors = [];
const warnings = [];
const infos = [];

// 1. Layout Metadata Check
function checkLayoutMetadata() {
  const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
  
  if (!fs.existsSync(layoutPath)) {
    errors.push({ pass: false, message: 'layout.tsx not found', severity: 'error' });
    return;
  }

  const content = fs.readFileSync(layoutPath, 'utf-8');
  
  if (!content.includes('export const metadata:')) {
    errors.push({ pass: false, message: 'Missing metadata export in layout.tsx', severity: 'error' });
  }
  
  if (!content.includes('description:')) {
    warnings.push({ pass: false, message: 'Missing description in metadata', severity: 'warning' });
  }
  
  if (!content.includes('openGraph:')) {
    warnings.push({ pass: false, message: 'Missing Open Graph tags', severity: 'warning' });
  }
  
  if (!content.includes('twitter:')) {
    warnings.push({ pass: false, message: 'Missing Twitter Card tags', severity: 'warning' });
  }
  
  if (!content.includes('application/ld+json')) {
    warnings.push({ pass: false, message: 'Missing structured data (JSON-LD)', severity: 'warning' });
  }

  console.log('✓ Layout metadata check completed');
}

// 2. Robots.txt Check
function checkRobotsTxt() {
  const robotsPath = path.join(process.cwd(), 'app', 'robots.txt');
  
  if (!fs.existsSync(robotsPath)) {
    errors.push({ pass: false, message: 'robots.txt not found in app directory', severity: 'error' });
    return;
  }

  const content = fs.readFileSync(robotsPath, 'utf-8');
  const requiredTerms = ['User-agent:', 'Allow:', 'sitemap:'];
  
  for (const term of requiredTerms) {
    if (!content.includes(term)) {
      errors.push({ pass: false, message: 'Missing "' + term + '" in robots.txt', severity: 'error' });
    }
  }

  console.log('✓ Robots.txt check completed');
}

// 3. Sitemap Check
function checkSitemap() {
  const sitemapPath = path.join(process.cwd(), 'app', 'sitemap.ts');
  
  if (!fs.existsSync(sitemapPath)) {
    errors.push({ pass: false, message: 'sitemap.ts not found in app directory', severity: 'error' });
    return;
  }

  const content = fs.readFileSync(sitemapPath, 'utf-8');
  
  if (!content.includes('sitemap')) {
    errors.push({ pass: false, message: 'Missing sitemap generation logic', severity: 'error' });
  }

  console.log('✓ Sitemap check completed');
}

// 4. Open Graph Image Check
function checkOGImages() {
  const ogRoutePath = path.join(process.cwd(), 'app', 'api', 'og', 'route.tsx');
  
  if (fs.existsSync(ogRoutePath)) {
    const content = fs.readFileSync(ogRoutePath, 'utf-8');
    
    if (!content.includes('width:') || !content.includes('height:')) {
      warnings.push({ pass: false, message: 'OG image missing dimensions', severity: 'warning' });
    }
    
    if (!content.includes('1200') || !content.includes('630')) {
      warnings.push({ pass: false, message: 'OG image dimensions not recommended (1200x630)', severity: 'warning' });
    }
    
    console.log('✓ Open Graph image endpoint check completed');
  } else {
    warnings.push({ pass: false, message: 'OG image endpoint not found', severity: 'warning' });
  }
}

// 5. Dynamic Metadata Check for Stock Pages
function checkDynamicMetadata() {
  const stockPagePath = path.join(process.cwd(), 'app', 'stocks', '[symbol]', 'page.tsx');
  
  if (!fs.existsSync(stockPagePath)) {
    errors.push({ pass: false, message: 'Stock detail page not found', severity: 'error' });
    return;
  }

  const content = fs.readFileSync(stockPagePath, 'utf-8');
  
  if (!content.includes('generateMetadata')) {
    warnings.push({ pass: false, message: 'Stock pages don\'t have dynamic metadata', severity: 'warning' });
  } else {
    infos.push({ pass: true, message: 'Stock pages have dynamic metadata', severity: 'info' });
  }

  console.log('✓ Dynamic metadata check completed');
}

// 6. Manifest.json Check
function checkManifest() {
  const manifestPath = path.join(process.cwd(), 'app', 'manifest.json');
  
  if (fs.existsSync(manifestPath)) {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);
    
    if (!manifest.name || !manifest.short_name) {
      errors.push({ pass: false, message: 'Manifest missing required fields (name, short_name)', severity: 'error' });
    }
    
    if (!manifest.icons || manifest.icons.length === 0) {
      warnings.push({ pass: false, message: 'Manifest missing icons', severity: 'warning' });
    }
  } else {
    warnings.push({ pass: false, message: 'manifest.json not found', severity: 'warning' });
  }

  console.log('✓ Manifest check completed');
}

// Run all checks
console.log('Starting comprehensive SEO audit...\n');
checkLayoutMetadata();
checkRobotsTxt();
checkSitemap();
checkOGImages();
checkDynamicMetadata();
checkManifest();

// Report results
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 SEO Audit Results');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const allResults = errors.map(err => ({ ...err, type: '❌ Error' }))
  .concat(warnings.map(warn => ({ ...warn, type: '⚠️ Warning' })))
  .concat(infos.map(info => ({ ...info, type: 'ℹ️ Info' })));

for (const result of allResults) {
  console.log(result.type + ': ' + result.message);
}

console.log('\nTotal Issues:');
console.log('  ❌ Errors: ' + errors.length);
console.log('  ⚠️ Warnings: ' + warnings.length);
console.log('  ℹ️ Info: ' + infos.length);

const overallScore = 100 - (errors.length * 20) - (warnings.length * 10);
console.log('\nOverall Score: ' + Math.max(0, overallScore) + '/100');

if (errors.length === 0 && warnings.length <= 2) {
  console.log('\n✅ SEO implementation is comprehensive!');
  process.exit(0);
} else {
  console.log('\n⚠️ Some issues need attention.');
  process.exit(1);
}
