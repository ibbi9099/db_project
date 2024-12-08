const connectDB = require("../config/db");
const oracledb = require("oracledb");

// Add Bookmark
const addBookmark = async (req, res) => {
  const userId = req.user?.id;
  const { caseId } = req.body;

  if (!userId || !caseId) {
    return res.status(400).json({ success: false, message: "User ID and Case ID are required." });
  }

  try {
    const connection = await connectDB();

    // Check if the case is already bookmarked
    const checkResult = await connection.execute(
      `SELECT * FROM Bookmarks WHERE UserID = :userId AND CaseID = :caseId`,
      { userId: Number(userId), caseId: Number(caseId) },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Case is already bookmarked." });
    }

    // Insert the bookmark
    await connection.execute(
      `INSERT INTO Bookmarks (BookmarkID, UserID, CaseID) 
       VALUES (bookmark_id_seq.NEXTVAL, :userId, :caseId)`,
      { userId: Number(userId), caseId: Number(caseId) },
      { autoCommit: true }
    );

    res.status(201).json({ success: true, message: "Case bookmarked successfully." });
  } catch (error) {
    console.error("Error adding bookmark:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Get Bookmarked Cases
const getBookmarkedCases = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }
  
    try {
      const connection = await connectDB();
      const result = await connection.execute(
        `SELECT b.BookmarkID, c.CaseID, c.Title, c.Description, c.Category, c.DateAdded
         FROM Bookmarks b
         JOIN Cases c ON b.CaseID = c.CaseID
         WHERE b.UserID = :userId`,
        { userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      console.log("Fetched Bookmarked Cases with BookmarkID:", result.rows); // Debugging log
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      console.error("Error fetching bookmarked cases:", error.message);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
};

// Remove Bookmark
const removeBookmark = async (req, res) => {
    try {
      const userId = req.user?.id; // Extract user ID from token
      const bookmarkId = parseInt(req.params.bookmarkId, 10); // Extract BookmarkID from params
  
      console.log("UserID received in removeBookmark:", userId); // Debug log
      console.log("BookmarkID received in removeBookmark:", bookmarkId); // Debug log
  
      // Validate inputs
      if (!userId || isNaN(bookmarkId)) {
        console.error("Invalid UserID or BookmarkID:", { userId, bookmarkId });
        return res.status(400).json({
          success: false,
          message: "Invalid UserID or BookmarkID",
        });
      }
  
      const connection = await connectDB();
  
      // Execute the DELETE query
      const result = await connection.execute(
        `DELETE FROM Bookmarks WHERE BookmarkID = :bookmarkId AND UserID = :userId`,
        { bookmarkId, userId },
        { autoCommit: true }
      );
  
      console.log("Rows affected in DELETE query:", result.rowsAffected); // Log rows affected
  
      if (result.rowsAffected === 0) {
        return res.status(404).json({
          success: false,
          message: "Bookmark not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Bookmark removed successfully",
      });
    } catch (error) {
      console.error("Error in removeBookmark:", error.message);
      res.status(500).json({
        success: false,
        message: "Error removing bookmark",
      });
    }
  };
module.exports = { addBookmark, getBookmarkedCases, removeBookmark };
