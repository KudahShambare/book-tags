import PDFDocument from "pdfkit";
import fs from "fs";

// ---------------------- STUDENT-SUBJECT MAPPING ----------------------
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

// ---------------------- PDF GENERATOR ----------------------
export const generatePDF = (allStudents, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: [841.89, 595.28], // A4 Landscape
        margins: { top: 20, bottom: 20, left: 20, right: 20 }
      });

      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);

      // ---------------------- PAGE SETTINGS ----------------------
      const pageWidth = 841.89;
      const pageHeight = 595.28;

      const marginX = 20;
      const marginY = 20;
      const gapX = 15;
      const gapY = 15;

      // 13cm x 8cm rectangle in points
      const rectWidth = 13 * 28.3465;
      const rectHeight = 8 * 28.3465;

      const paddingX = 15;
      const paddingY = 15;

      // Starting coordinates
      let x = marginX;
      let y = marginY;

      // ---------------------- STUDENT CARDS ----------------------
      allStudents.forEach((entry, index) => {
        // Draw rectangle
        doc.roundedRect(x, y, rectWidth, rectHeight, 5)
          .lineWidth(1.5)
          .stroke();

        // ---------------------- CONTENT SETTINGS ----------------------
  // -------------------- VERTICALLY CENTERED 2-COLUMN TEXT WITH GAP --------------------

const fontSize = 20;
const labelWidth = 140;
const columnGap = 18;
const rowGap = 20; // <- vertical gap between rows (adjust this as you like)

// ROW DEFINITIONS
const rows = [
  { type: "row", label: "Name", value: entry.student },
  { type: "row", label: "Subject", value: entry.subject },
  { type: "spacer", height: 12 }, // optional extra gap
  { type: "row", label: "Class", value: entry.class },
  { type: "row", label: "Year", value: String(entry.year) }
];

// CALCULATE TOTAL HEIGHT
let totalContentHeight = 0;

rows.forEach(item => {
  if (item.type === "spacer") {
    totalContentHeight += item.height;
    return;
  }

  const labelHeight = doc.font("Helvetica-Bold").fontSize(fontSize)
    .heightOfString(`${item.label}:`, { width: labelWidth });

  const valueHeight = doc.font("Helvetica-Bold").fontSize(fontSize)
    .heightOfString(item.value, { width: rectWidth - 2 * paddingX - labelWidth - columnGap });

  totalContentHeight += Math.max(labelHeight, valueHeight) + rowGap;
});

// VERTICALLY CENTER
let cursorY = y + (rectHeight - totalContentHeight) / 2;

// DRAW ROWS
rows.forEach(item => {
  if (item.type === "spacer") {
    cursorY += item.height;
    return;
  }

  const labelX = x + paddingX;
  const valueX = labelX + labelWidth + columnGap;
  const valueWidth = rectWidth - 2 * paddingX - labelWidth - columnGap;

  const labelHeight = doc.font("Helvetica-Bold").fontSize(fontSize)
    .heightOfString(`${item.label}:`, { width: labelWidth });
  const valueHeight = doc.font("Helvetica-Bold").fontSize(fontSize)
    .heightOfString(item.value, { width: valueWidth });

  const rowHeight = Math.max(labelHeight, valueHeight);

  // LABEL
  doc.font("Helvetica-Bold").fontSize(fontSize)
    .text(`${item.label}:`, labelX, cursorY, { width: labelWidth });

  // VALUE
  doc.font("Helvetica-Bold").fontSize(fontSize)
    .text(item.value, valueX, cursorY, { width: valueWidth });

  cursorY += rowHeight + rowGap; // <- add rowGap after each row
});
// --------------------------------------------------------------------------

        // ---------------------- POSITION NEXT CARD ----------------------
        const positionInPage = index % 4;

        if (positionInPage === 0) {
          x = marginX + rectWidth + gapX;
          y = marginY;
        } else if (positionInPage === 1) {
          x = marginX;
          y = marginY + rectHeight + gapY;
        } else if (positionInPage === 2) {
          x = marginX + rectWidth + gapX;
          y = marginY + rectHeight + gapY;
        } else if (positionInPage === 3) {
          if (index < allStudents.length - 1) {
            doc.addPage({
              size: [841.89, 595.28],
              margins: { top: 20, bottom: 20, left: 20, right: 20 }
            });
          }
          x = marginX;
          y = marginY;
        }
      });

      // ---------------------- FINALIZE ----------------------
      doc.end();

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
