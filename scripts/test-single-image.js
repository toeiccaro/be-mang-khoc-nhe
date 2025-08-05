/**
 * Script để test OCR với một hình ảnh đơn lẻ
 */

const Tesseract = require('tesseract.js');
const path = require('path');
const fs = require('fs');

async function testSingleImage(imagePath) {
  console.log(`🔍 Testing OCR on: ${imagePath}`);
  
  if (!fs.existsSync(imagePath)) {
    console.error(`❌ File not found: ${imagePath}`);
    return;
  }

  try {
    console.log('🚀 Starting OCR...');
    
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng+vie', {
      logger: m => {
        if (m.status === 'recognizing text') {
          process.stdout.write(`\rOCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    
    console.log('\n✅ OCR completed!');
    console.log('\n📄 Extracted text:');
    console.log('=' * 50);
    console.log(text);
    console.log('=' * 50);
    
    // Parse specific formats
    if (imagePath.includes('.A.')) {
      console.log('\n🎯 Parsing Answer:');
      const answerMatch = text.match(/Answer:\s*([A-D])/i);
      if (answerMatch) {
        console.log(`Correct Answer: ${answerMatch[1].toUpperCase()}`);
      } else {
        console.log('Could not parse answer format');
      }
    }
    
    if (imagePath.includes('.O.')) {
      console.log('\n📝 Parsing Options:');
      const lines = text.split('\n').filter(line => line.trim());
      const options = {};
      
      for (const line of lines) {
        const match = line.match(/^([A-D])\.\s*(.+)$/);
        if (match) {
          const [, letter, content] = match;
          options[letter.toUpperCase()] = content.trim();
          console.log(`${letter.toUpperCase()}: ${content.trim()}`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ OCR Error:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 Usage: node test-single-image.js <image-path>');
    console.log('📋 Example: node test-single-image.js ../public/images/1.A.PNG');
    
    // Test với file đầu tiên có sẵn
    const imagesDir = path.join(__dirname, '../public/images');
    const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.PNG'));
    
    if (files.length > 0) {
      const testFile = path.join(imagesDir, files[0]);
      console.log(`\n🧪 Testing with first available file: ${files[0]}`);
      await testSingleImage(testFile);
    } else {
      console.log('❌ No PNG files found in public/images/');
    }
    return;
  }
  
  const imagePath = path.resolve(args[0]);
  await testSingleImage(imagePath);
}

if (require.main === module) {
  main();
}
