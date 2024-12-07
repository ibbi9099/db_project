const oracledb = require("oracledb");
const connectDB = require("../config/db");

const insertFile = async ({ caseId, fileName, fileType, fileSize, fileData, uploadedBy }) => {
  let connection;
  try {
    connection = await connectDB();
    await connection.execute(
      `INSERT INTO Files (FileID, CaseID, FileName, FileType, FileSize, FileData, UploadedBy)
       VALUES (file_id_seq.NEXTVAL, :caseId, :fileName, :fileType, :fileSize, :fileData, :uploadedBy)`,
      {
        caseId,
        fileName,
        fileType,
        fileSize,
        fileData,
        uploadedBy,
      },
      { autoCommit: true }
    );
  } catch (error) {
    throw error;
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { insertFile };
