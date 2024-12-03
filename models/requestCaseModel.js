  const connectDB = require('../config/db');

const requestCaseModel = {
  async createRequest(userId, caseTitle, caseDescription, lawyer, requestedDate) {
    const connection = await connectDB();

    // Format the requestedDate without milliseconds and 'Z'
    const formattedRequestedDate = new Date(requestedDate).toISOString().replace('T', ' ').split('.')[0];

    console.log('Formatted requestedDate:', formattedRequestedDate);

    const query = `
      INSERT INTO CaseRequests (RequestID, UserID, Title, Description, Status, Lawyer, REQUESTEDDATE)
      VALUES (case_request_id_seq.NEXTVAL, :userId, :title, :description, 'Pending', :lawyer, TO_TIMESTAMP(:requestedDate, 'YYYY-MM-DD HH24:MI:SS'))
    `;

    await connection.execute(
      query,
      {
        userId,
        title: caseTitle,
        description: caseDescription,
        lawyer,
        requestedDate: formattedRequestedDate // Pass the formatted date
      },
      { autoCommit: true }
    );

    await connection.close();
  },
};

module.exports = requestCaseModel;