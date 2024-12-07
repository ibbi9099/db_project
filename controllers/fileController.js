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
const downloadFile = async (req, res) => {
  const { fileId } = req.params; // Extract fileId from request parameters

  let connection;
  try {
    connection = await connectDB();

    const query = `
      SELECT FileName, FileData
      FROM Files
      WHERE FileID = :fileId
    `;
    const result = await connection.execute(query, [fileId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    const [fileName, fileData] = result.rows[0];

    // Set headers for inline display
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.setHeader("Content-Type", "application/pdf"); // Set MIME type for PDF
    res.send(fileData); // Send the file as a binary response
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ success: false, message: "Error fetching file" });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { uploadFile, downloadFile };
