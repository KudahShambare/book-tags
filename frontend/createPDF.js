import PDFDocument from "pdfkit";
import fs from "fs";

// Generate a student-subject mapping
export const studentPlusSubject = (students) => {
  const subjects = [
    "Mathematics",
    "English",
    "Science & Technology",
    "Social Sciences",
    "Art",
    "P.E & Arts",
    "Homework",
    "Shona"
  ];

  const studentSubject = [];
  for (let i = 0; i < students.length; i++) {
    for (let j = 0; j < subjects.length; j++) {
      studentSubject.push({
        student: students[i].name,
        subject: subjects[j],
        class: students[i].className,
        year: new Date().getFullYear()
      });
    }
  }
  return studentSubject;
};

export const generatePDF = (allStudents, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [841.89, 595.28], // A4 Landscape
        margins: { top: 20, bottom: 20, left: 20, right: 20 }
      });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // PDF Page Dimensions (A4 Landscape: 841.89 x 595.28 points)
      const pageWidth = 841.89;
      const pageHeight = 595.28;

      // Margins
      const marginX = 20;
      const marginY = 20;
      const gapX = 15; // Horizontal gap between rectangles
      const gapY = 15; // Vertical gap between rectangles

      // Rectangle dimensions: 13cm × 8cm
      // Convert cm to points (1 cm = 28.3465 points)
      const rectWidth = 13 * 28.3465;  // 13 cm = 368.5 points
      const rectHeight = 8 * 28.3465;   // 8 cm = 226.8 points
      
      // Padding inside each rectangle
      const paddingX = 15;
      const paddingY = 15;

      // Starting coordinates
      let x = marginX;
      let y = marginY;

      // Add content dynamically for each student
      allStudents.forEach((entry, index) => {
        // Draw a rectangle for the student section with rounded corners
        doc.roundedRect(x, y, rectWidth, rectHeight, 5)
           .lineWidth(1.5)
           .stroke();

        // Add student details inside the rectangle with bold text
        doc.fontSize(20).font("Helvetica-Bold");
        
        // Calculate vertical spacing to distribute text evenly
        const contentHeight = 120; // Total height of all text
        const textStartY = y + paddingY;
        const lineSpacing = (rectHeight - 2 * paddingY - contentHeight) / 3;
        
        doc.text(`Name: ${entry.student}`, x + paddingX, textStartY, {
          width: rectWidth - 2 * paddingX
        });
        doc.text(`Subject: ${entry.subject}`, x + paddingX, textStartY + 30 + lineSpacing, {
          width: rectWidth - 2 * paddingX
        });
        doc.text(`Class: ${entry.class}`, x + paddingX, textStartY + 60 + 2 * lineSpacing, {
          width: rectWidth - 2 * paddingX
        });
        doc.text(`Year: ${entry.year}`, x + paddingX, textStartY + 90 + 3 * lineSpacing, {
          width: rectWidth - 2 * paddingX
        });

        // Move to next position
        const positionInPage = index % 4;
        
        if (positionInPage === 0) {
          // Top-left (already positioned)
          x = marginX + rectWidth + gapX; // Next: top-right
          y = marginY;
        } else if (positionInPage === 1) {
          // Top-right, move to bottom-left
          x = marginX;
          y = marginY + rectHeight + gapY;
        } else if (positionInPage === 2) {
          // Bottom-left, move to bottom-right
          x = marginX + rectWidth + gapX;
          y = marginY + rectHeight + gapY;
        } else if (positionInPage === 3) {
          // Bottom-right, add new page if more entries exist
          if (index < allStudents.length - 1) {
            doc.addPage({
              size: [841.89, 595.28], // A4 Landscape
              margins: { top: 20, bottom: 20, left: 20, right: 20 }
            });
          }
          x = marginX;
          y = marginY;
        }
      });

      // Finalize the PDF
      doc.end();

      // Handle the stream finish and errors
      writeStream.on("finish", () => {
        console.log("PDF generated successfully at:", filePath);
        resolve(filePath);
      });

      writeStream.on("error", (error) => {
        console.error("Error writing PDF file:", error);
        reject(error);
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};