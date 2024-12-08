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
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }

  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `
      SELECT 
        c.CaseID, 
        c.Title, 
        c.Description, 
        c.Category, 
        c.DateAdded, 
        f.FileID, 
        f.FileName 
      FROM 
        Cases c
      LEFT JOIN 
        Files f ON c.CaseID = f.CaseID
      WHERE 
        c.AddedBy = :userId
      `,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ success: false, message: "Error fetching cases" });
  } finally {
    if (connection) await connection.close();
  }
};
const getDistinctCategories = async (req, res) => {
  let connection;
  try {
    connection = await connectDB();

    // Convert categories to lowercase and get distinct
    const result = await connection.execute(
      `SELECT DISTINCT LOWER(Category) as category FROM Cases WHERE Category IS NOT NULL ORDER BY category`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const categories = result.rows.map(row => row.CATEGORY);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Error fetching categories" });
  } finally {
    if (connection) await connection.close();
  }
};

const searchCasesByCategory = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ success: false, message: "Category is required" });
  }

  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT c.CaseID, c.Title, c.Description, c.Category, c.DateAdded, u.Name as AddedBy
       FROM Cases c
       JOIN Users u ON c.AddedBy = u.UserID
       WHERE LOWER(c.Category) = :category`,
      { category: category.toLowerCase() },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error("Error searching cases by category:", error);
    res.status(500).json({ success: false, message: "Error searching cases" });
  } finally {
    if (connection) await connection.close();
  }
};
const getCaseById = async (req, res) => {
  const { id } = req.params;
  let connection;
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT c.CaseID, c.Title, c.Description, c.Category, c.DateAdded, u.Name AS AddedBy, f.FileID
       FROM Cases c
       JOIN Users u ON c.AddedBy = u.UserID
       LEFT JOIN Files f ON c.CaseID = f.CaseID
       WHERE c.CaseID = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error fetching case details:", error);
    res.status(500).json({ success: false, message: "Error fetching case details" });
  } finally {
    if (connection) await connection.close();
  }
};
const deleteCase = async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await connectDB();

    // Check if the case exists
    const caseExists = await connection.execute(
      'SELECT CaseID FROM Cases WHERE CaseID = :id',
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!caseExists.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    // Delete related files first (if applicable)
    await connection.execute(
      'DELETE FROM Files WHERE CaseID = :id',
      { id },
      { autoCommit: false }
    );

    // Delete the case
    await connection.execute(
      'DELETE FROM Cases WHERE CaseID = :id',
      { id },
      { autoCommit: false }
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      message: "Case deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting case:", error);

    if (connection) {
      await connection.rollback();
    }

    res.status(500).json({
      success: false,
      message: "Error deleting the case",
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};



module.exports = {
  
  addCase,
  getMyCases,
  getDistinctCategories,
  searchCasesByCategory,
  getCaseById,
  deleteCase
};