import PDFDocument from "pdfkit";
import blobStream from "blob-stream";

// Generate a student-subject mapping
export const studentPlusSubject = (students) => {
    //Parameter description - students: array of student names, subjects: array of subject names, className: string, cardYear: string
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
        year:new Date().getFullYear()
      });
    }
  }
  return studentSubject;
};

export const generatePDF = async (allStudents) => {
  const doc = new PDFDocument({
    size: [841.89, 595.28], // A4 Landscape
    margins: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    }
  });

  const stream = doc.pipe(blobStream());

  // PDF Page Dimensions (A4 Landscape: 841.89 x 595.28 points)
  const pageWidth = 841.89; // points
  const pageHeight = 595.28; // points

  // Margins
  const marginX = 20;
  const marginY = 20;

  // Rectangle dimensions to fit 3 columns and 2 rows
  const rectWidth = (pageWidth - 0.0009 * marginX) / 2.5;
  const rectHeight = 140;

  // Starting coordinates
  let x = marginX;
  let y = marginY;

  // Add content dynamically for each student
  allStudents.forEach((entry, index) => {
    // Draw a rectangle for the student section with a dotted border
    doc.rect(x, y, rectWidth, rectHeight).lineWidth(4).stroke();

    // Add student details inside the rectangle with bold text
    doc.fontSize(16).font("Helvetica-Bold");
    
    // Align the text to the left
    doc.text(`Name       :     ${entry.student}`, x + 10, y + 20);
    doc.text(`Subject    :     ${entry.subject}`, x + 10, y + 50);
    doc.text(`Class       :     ${entry.class}`, x + 10, y + 80);
    doc.text(`Year         :     ${entry.year}`, x + 10, y + 110);

    // Move to the next rectangle position
    x += rectWidth + marginX; // Move horizontally
    if (x + rectWidth > pageWidth) {
      x = marginX; // Reset X
      y += rectHeight + marginY; // Move to the next row
    }

    // Add a new page after every 6 rectangles
    if ((index + 1) % 6 === 0) {
      doc.addPage({
        size: [841.89, 595.28], // A4 Landscape
        margins: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      });
      x = marginX; // Reset X
      y = marginY; // Reset Y
    }
  });

  // Finalize the PDF
  doc.end();

  return stream;
};