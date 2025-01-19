
import express from "express";
import PDFDocument from "pdfkit";

const app = express();


const students = [
  "Tendai Moyo",
  "Chipo Ndlovu",
  "Farai Chitungo",
  "Rutendo Dube",
  "Kudakwashe Muzenda",
  "Tafadzwa Chiwenga",
  "Nyasha Mandizvidza",
  "Ropafadzo Mugabe",
  "Simba Matanga",
  "Tatenda Gatsi"
];

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

// Generate a student-subject mapping
const studentlusSubject = (students, subjects, className, cardYear) => {
  const studentSubject = [];
  for (let i = 0; i < students.length; i++) {
    for (let j = 0; j < subjects.length; j++) {
      studentSubject.push({
        student: students[i],
        subject: subjects[j],
        class: className,
        year: cardYear
      });
    }
  }
  return studentSubject;
};

let allStudents = studentlusSubject(students, subjects, "2 Blue", "2025");

const generatePDF = (allStudents, res) => {
  const doc = new PDFDocument({
    size: [841.89, 595.28], // A4 Landscape
    margins: {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20
    }
  });

  // Stream the PDF directly to the client
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline; filename=students.pdf");

  doc.pipe(res);

  // PDF Page Dimensions (A4 Landscape: 841.89 x 595.28 points)
  const pageWidth = 841.89; // points
  const pageHeight = 595.28; // points

  // Margins
  const marginX = 20;
  const marginY = 20;

  // Rectangle dimensions to fit 3 columns and 2 rows
  const rectWidth = (pageWidth - 2 * marginX) / 3;
  const rectHeight = 140;

  // Starting coordinates
  let x = marginX;
  let y = marginY;

  // Add content dynamically for each student
  allStudents.forEach((entry, index) => {
    // Draw a rectangle for the student section with a dotted border
    doc.rect(x, y, rectWidth, rectHeight).lineWidth(4).stroke();

    // Add student details inside the rectangle with bold text
    doc.fontSize(14).font("Helvetica-Bold");
    
    // Align the text to the left
    doc.text(`Name         :      ${entry.student}`, x + 10, y + 20);
    doc.text(`Subject      :      ${entry.subject}`, x + 10, y + 50);
    doc.text(`Class         :      ${entry.class}`, x + 10, y + 80);
    doc.text(`Year           :      ${entry.year}`, x + 10, y + 110);

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
};

// Route to generate the PDF
app.get("/file", (req, res) => {
  generatePDF(allStudents, res);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});