import express from "express";
import path from "path";
import fs from 'fs'; // Import the fs module


import { generatePDF,studentPlusSubject } from "./frontend/createPDF.js";


const app = express();

const __dirname = path.resolve()

app.use(express.static(path.join(__dirname, "frontend")));

// Middleware to parse JSON
app.use(express.json());



/**************************Routes */
//Home Page
app.get("/", (req, res) => {
  res.sendFile( path.join(__dirname + "/frontend/index.html"));
});


app.get("/download", (req, res) => {
  res.sendFile(path.join(__dirname, "output", "students.pdf"));
});

// Route to generate the PDF

app.post("/file", async (req, res) => {
  try {
    const students = req.body.students;
    const allStudents = studentPlusSubject(students);

    // Define the file path
    const filePath = path.join(__dirname, "output", "students.pdf");

    // Ensure the output directory exists
    const outputDir = path.dirname(filePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate the PDF and save it
    await generatePDF(allStudents, filePath);

    res.status(200).send({ message: "PDF generated and saved successfully", filePath });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF");
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});