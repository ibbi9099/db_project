const oracledb = require("oracledb");
const connectDB = require("../config/db");

const uploadFile = async (req, res) => {
  const { caseId, uploadedBy } = req.body; // These should come from the frontend
  const file = req.file;

  if (!caseId || !uploadedBy || !file) {
    return res
      .status(400)
      .json({ success: false, message: "Case ID, UploadedBy, and file are required" });
  }

  let connection;
  try {
    connection = await connectDB();

    const { originalname, mimetype, size, buffer } = file;
    const fileType = mimetype.split("/")[1].toUpperCase();

    await connection.execute(
      `INSERT INTO Files (FileID, CaseID, FileName, FileType, FileSize, FileData, UploadedBy)
       VALUES (file_id_seq.NEXTVAL, :caseId, :fileName, :fileType, :fileSize, :fileData, :uploadedBy)`,
      {
        caseId,
        fileName: originalname,
        fileType,
        fileSize: size,
        fileData: buffer,
        uploadedBy,
      },
      { autoCommit: true }
    );

    res.status(200).json({ success: true, message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ success: false, message: "Error uploading file" });
  } finally {
    if (connection) await connection.close();
  }
};

const downloadFileByCaseId = async (req, res) => {
  const caseId = parseInt(req.params.caseId, 10);

  console.log("Received Case ID:", caseId);

  if (isNaN(caseId)) {
    console.error("Invalid Case ID:", caseId);
    return res.status(400).json({ success: false, message: "Invalid Case ID" });
  }

  let connection;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT FileData, FileName, FileType FROM Files WHERE CaseID = :caseId`,
      { caseId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows.length) {
      console.error(`No file found for Case ID: ${caseId}`);
      return res.status(404).json({ success: false, message: "File not found for the given Case ID" });
    }

    const { FILEDATA, FILENAME, FILETYPE } = result.rows[0];

    if (!FILEDATA) {
      console.error("File data missing for Case ID:", caseId);
      return res.status(404).json({ success: false, message: "File data not found" });
    }

    console.log(`Reading LOB data for Case ID: ${caseId}`);

    const chunks = [];
    const lob = FILEDATA;

    // Read the LOB into chunks
    await new Promise((resolve, reject) => {
      lob.on("data", (chunk) => {
        chunks.push(chunk);
        console.log(`Received chunk of data, size: ${chunk.length}`);
      });

      lob.on("end", () => {
        console.log("LOB stream ended.");
        resolve();
      });

      lob.on("error", (err) => {
        console.error("Error reading LOB:", err);
        reject(err);
      });
    });

    const fileBuffer = Buffer.concat(chunks);

    console.log("Final buffer size:", fileBuffer.length);

    // Serve the file as a response
    res.writeHead(200, {
      "Content-Type": "application/pdf", // Set content type to PDF
      "Content-Disposition": `inline; filename="${FILENAME}"`, // Inline display in browser
      "Content-Length": fileBuffer.length,
    });

    res.end(fileBuffer);
  } catch (error) {
    console.error("Error in downloadFileByCaseId:", error);
    res.status(500).json({ success: false, message: "Error downloading file" });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { uploadFile, downloadFileByCaseId };
