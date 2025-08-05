/**
 * Script để tạo sample data cho image-based questions
 * Không cần OCR, chỉ tạo structure mẫu để test
 */

const fs = require('fs');
const path = require('path');

function createSampleImageData() {
  const sampleData = {
    exams: [
      {
        id: "image_based_sample",
        name: "Đề thi mẫu từ hình ảnh",
        description: "Đề thi mẫu để test hiển thị hình ảnh",
        duration: 15,
        totalQuestions: 3,
        questions: [
          {
            id: 1,
            question: {
              type: "image",
              content: "/images/1.Q.PNG"
            },
            options: {
              type: "text",
              content: {
                A: "=HLOOKUP, IF",
                B: "=HLOOKUP, MATCH", 
                C: "=HLOOKUP, RIGHT, LEFT",
                D: "=HLOOKUP, MID, IF"
              }
            },
            correctAnswer: "B"
          },
          {
            id: 2,
            question: {
              type: "image", 
              content: "/images/2.Q.PNG"
            },
            options: {
              type: "text",
              content: {
                A: "Option A for question 2",
                B: "Option B for question 2",
                C: "Option C for question 2", 
                D: "Option D for question 2"
              }
            },
            correctAnswer: "A"
          },
          {
            id: 3,
            question: {
              type: "text",
              content: "Đây là câu hỏi text thông thường để test backward compatibility"
            },
            options: {
              type: "text",
              content: {
                A: "Đáp án A",
                B: "Đáp án B", 
                C: "Đáp án C",
                D: "Đáp án D"
              }
            },
            correctAnswer: "C"
          }
        ]
      }
    ]
  };

  // Đọc data.json hiện tại
  const dataPath = path.join(__dirname, '../public/data.json');
  let existingData = { exams: [] };
  
  try {
    if (fs.existsSync(dataPath)) {
      existingData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    }
  } catch (error) {
    console.log('Không thể đọc data.json hiện tại, tạo mới');
  }

  // Thêm sample exam vào data hiện tại
  const imageExamIndex = existingData.exams.findIndex(exam => exam.id === "image_based_sample");
  
  if (imageExamIndex >= 0) {
    // Update existing
    existingData.exams[imageExamIndex] = sampleData.exams[0];
    console.log('✅ Updated existing image-based sample exam');
  } else {
    // Add new
    existingData.exams.push(sampleData.exams[0]);
    console.log('✅ Added new image-based sample exam');
  }

  // Lưu file
  try {
    fs.writeFileSync(dataPath, JSON.stringify(existingData, null, 2), 'utf8');
    console.log(`✅ Successfully updated ${dataPath}`);
    console.log(`📊 Total exams: ${existingData.exams.length}`);
  } catch (error) {
    console.error('❌ Error saving file:', error);
  }
}

// Tạo thư mục images nếu chưa có
function ensureImagesDirectory() {
  const imagesDir = path.join(__dirname, '../public/images');
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
    console.log('📁 Created images directory');
  }
  
  // Tạo file placeholder nếu chưa có hình ảnh thật
  const placeholderFiles = ['1.Q.PNG', '2.Q.PNG'];
  
  placeholderFiles.forEach(filename => {
    const filePath = path.join(imagesDir, filename);
    if (!fs.existsSync(filePath)) {
      // Tạo file placeholder text
      const placeholderContent = `Placeholder for ${filename}\nThis file should contain the actual question image.`;
      fs.writeFileSync(filePath.replace('.PNG', '.txt'), placeholderContent);
      console.log(`📝 Created placeholder for ${filename}`);
    }
  });
}

function main() {
  console.log('🚀 Creating sample image-based data...');
  
  ensureImagesDirectory();
  createSampleImageData();
  
  console.log('\n🎉 Sample data creation completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Add actual image files to public/images/');
  console.log('2. Run: npm run convert-images (when you have real images)');
  console.log('3. Start the app: npm start');
}

if (require.main === module) {
  main();
}

module.exports = { createSampleImageData, ensureImagesDirectory };
