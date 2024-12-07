const connectDB = require('../config/db');

const requestCaseModel = {
  async createRequest(userId, caseTitle, caseDescription, lawyer, requestedDate) {
    const connection = await connectDB();

    const formattedRequestedDate = requestedDate
      ? new Date(requestedDate).toISOString().replace('T', ' ').split('.')[0]
      : null;

    const query = `
      INSERT INTO CaseRequests (RequestID, UserID, Title, Description, Status, Lawyer, RequestedDate)
      VALUES (case_request_id_seq.NEXTVAL, :userId, :title, :description, 'Pending', :lawyer, 
      TO_TIMESTAMP(:requestedDate, 'YYYY-MM-DD HH24:MI:SS'))
    `;

    await connection.execute(
      query,
      {
        userId,
        title: caseTitle,
        description: caseDescription,
        lawyer,
        requestedDate: formattedRequestedDate,
      },
      { autoCommit: true }
    );

    await connection.close();
  },

  async getRequestsByUserId(userId) {
    const connection = await connectDB();
    const result = await connection.execute(
      `SELECT * FROM CaseRequests WHERE UserID = :userId`,
      { userId }
    );
    await connection.close();
    return result.rows;
  },

  async getAllRequests() {
    const connection = await connectDB();
    const result = await connection.execute(`SELECT * FROM CaseRequests`);
    await connection.close();
    return result.rows;
  },
};

module.exports = requestCaseModel;
