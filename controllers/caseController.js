const oracledb = require("oracledb");
const connectDB = require("../config/db");

const addCase = async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  const { title, description, category } = req.body;
  const file = req.file; // This will be set if a file is uploaded

  if (!title || !description) {
    return res.status(400).json({ success: false, message: "Title and Description are required" });
  }

  if (!userId) {
    return res.status(401).json({ success: false, message: "User ID is missing. Authorization failed." });
  }

  let connection;
  try {
    connection = await connectDB();

    // Insert case
    const caseResult = await connection.execute(
      `INSERT INTO Cases (CaseID, Title, Description, Category, AddedBy)
       VALUES (case_id_seq.NEXTVAL, :title, :description, :category, :addedBy)
       RETURNING CaseID INTO :caseId`,
      {
        title,
        description,
        category,
        addedBy: userId,
        caseId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: false }
    );

    const newCaseId = caseResult.outBinds.caseId[0];

    // If a file is provided, insert into Files
    if (file) {
      const { originalname, mimetype, size, buffer } = file;
      const fileType = mimetype.split("/")[1].toUpperCase();

      await connection.execute(
        `INSERT INTO Files (FileID, CaseID, FileName, FileType, FileSize, FileData, UploadedBy)
         VALUES (file_id_seq.NEXTVAL, :caseId, :fileName, :fileType, :fileSize, :fileData, :uploadedBy)`,
        {
          caseId: newCaseId,
          fileName: originalname,
          fileType: fileType,
          fileSize: size,
          fileData: buffer,
          uploadedBy: userId,
        },
        { autoCommit: false }
      );
    }

    await connection.commit();

    res.status(200).json({ success: true, message: "Case added successfully" });
  } catch (error) {
    console.error("Error adding case:", error);
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, message: "Error adding the case" });
  } finally {
    if (connection) await connection.close();
  }
};

const getMyCases = async (req, res) => {
  const userId = req.user?.id; // Extract user ID from the JWT

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let connection;
  try {
    connection = await connectDB();

    // Fetch cases added by the user
    const result = await connection.execute(
      `SELECT CaseID, Title, Description, Category, DateAdded 
       FROM Cases 
       WHERE AddedBy = :userId`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cases",
    });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { addCase, getMyCases };
