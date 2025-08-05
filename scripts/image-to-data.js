/**
 * Script để extract text từ hình ảnh và tạo data.json
 * Sử dụng Tesseract.js cho OCR
 */

const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

class ImageDataExtractor {
  constructor() {
    this.imagesDir = path.join(__dirname, '../public/images');
    this.outputFile = path.join(__dirname, '../public/data-from-images.json');
    this.questions = [];
  }

  /**
   * Lấy danh sách tất cả file hình ảnh
   */
  getImageFiles() {
    try {
      const files = fs.readdirSync(this.imagesDir);
      const imageFiles = files.filter(file => file.match(/\.(png|jpg|jpeg)$/i));
      
      // Group files by question number
      const grouped = {};
      imageFiles.forEach(file => {
        const match = file.match(/^(\d+)\.([AQO])\.png$/i);
        if (match) {
          const [, questionNum, type] = match;
          if (!grouped[questionNum]) {
            grouped[questionNum] = {};
          }
          grouped[questionNum][type.toUpperCase()] = file;
        }
      });
      
      return grouped;
    } catch (error) {
      console.error('Error reading images directory:', error);
      return {};
    }
  }

  /**
   * Extract text từ hình ảnh sử dụng OCR
   */
  async extractTextFromImage(imagePath) {
    try {
      console.log(`Processing: ${imagePath}`);
      const { data: { text } } = await Tesseract.recognize(imagePath, 'eng+vie', {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      return text.trim();
    } catch (error) {
      console.error(`Error processing ${imagePath}:`, error);
      return '';
    }
  }

  /**
   * Parse answer từ text (Answer: B -> B)
   */
  parseAnswer(answerText) {
    const match = answerText.match(/Answer:\s*([A-D])/i);
    return match ? match[1].toUpperCase() : 'A';
  }

  /**
   * Parse options từ text
   */
  parseOptions(optionsText) {
    const options = {};
    const lines = optionsText.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      const match = line.match(/^([A-D])\.\s*(.+)$/);
      if (match) {
        const [, letter, content] = match;
        options[letter.toUpperCase()] = content.trim();
      }
    }
    
    // Ensure all options A, B, C, D exist
    ['A', 'B', 'C', 'D'].forEach(letter => {
      if (!options[letter]) {
        options[letter] = `Option ${letter}`;
      }
    });
    
    return options;
  }

  /**
   * Process một câu hỏi từ các file hình ảnh
   */
  async processQuestion(questionNum, files) {
    console.log(`\n=== Processing Question ${questionNum} ===`);
    
    const question = {
      id: parseInt(questionNum),
      question: {
        type: "image",
        content: `/images/${files.Q}`
      },
      options: {
        type: "text",
        content: {}
      },
      correctAnswer: "A"
    };

    // Process Answer file (A)
    if (files.A) {
      const answerPath = path.join(this.imagesDir, files.A);
      const answerText = await this.extractTextFromImage(answerPath);
      question.correctAnswer = this.parseAnswer(answerText);
      console.log(`Answer: ${question.correctAnswer}`);
    }

    // Process Options file (O)
    if (files.O) {
      const optionsPath = path.join(this.imagesDir, files.O);
      const optionsText = await this.extractTextFromImage(optionsPath);
      question.options.content = this.parseOptions(optionsText);
      console.log(`Options:`, question.options.content);
    }

    // Question image path (Q)
    if (files.Q) {
      console.log(`Question Image: ${question.question.content}`);
    }

    return question;
  }

  /**
   * Process tất cả hình ảnh và tạo data.json
   */
  async processAllImages() {
    console.log('🚀 Starting image processing...');
    
    const imageGroups = this.getImageFiles();
    const questionNumbers = Object.keys(imageGroups).sort((a, b) => parseInt(a) - parseInt(b));
    
    console.log(`Found ${questionNumbers.length} questions to process`);
    
    for (const questionNum of questionNumbers) {
      try {
        const question = await this.processQuestion(questionNum, imageGroups[questionNum]);
        this.questions.push(question);
      } catch (error) {
        console.error(`Error processing question ${questionNum}:`, error);
      }
    }

    // Create exam structure
    const examData = {
      exams: [
        {
          id: "image_based_exam",
          name: "Đề thi từ hình ảnh",
          description: "Đề thi được tạo từ hình ảnh với OCR",
          duration: 15,
          totalQuestions: this.questions.length,
          questions: this.questions
        }
      ]
    };

    // Save to file
    try {
      fs.writeFileSync(this.outputFile, JSON.stringify(examData, null, 2), 'utf8');
      console.log(`\n✅ Successfully created ${this.outputFile}`);
      console.log(`📊 Processed ${this.questions.length} questions`);
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  /**
   * Merge với data.json hiện tại
   */
  async mergeWithExistingData() {
    const existingDataPath = path.join(__dirname, '../public/data.json');
    
    try {
      if (fs.existsSync(existingDataPath)) {
        const existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
        
        // Add image-based exam to existing exams
        const imageExam = {
          id: "image_based_exam",
          name: "Đề thi từ hình ảnh",
          description: "Đề thi được tạo từ hình ảnh với OCR",
          duration: 15,
          totalQuestions: this.questions.length,
          questions: this.questions
        };
        
        existingData.exams.push(imageExam);
        
        // Save merged data
        fs.writeFileSync(existingDataPath, JSON.stringify(existingData, null, 2), 'utf8');
        console.log(`\n✅ Merged image exam into existing data.json`);
      }
    } catch (error) {
      console.error('Error merging with existing data:', error);
    }
  }
}

// Main execution
async function main() {
  const extractor = new ImageDataExtractor();
  
  try {
    await extractor.processAllImages();
    await extractor.mergeWithExistingData();
    console.log('\n🎉 Image processing completed successfully!');
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ImageDataExtractor;
