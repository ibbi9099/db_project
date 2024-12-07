const oracledb = require("oracledb");

module.exports = {
  createCase: async (caseData) => {
    const { caseName, description, category, lawyerId } = caseData;
    const sql = `
      INSERT INTO Cases (CaseID, CaseName, Description, Category, LawyerID)
      VALUES (case_id_seq.NEXTVAL, :caseName, :description, :category, :lawyerId)
    `;
    const binds = { caseName, description, category, lawyerId };
    const options = { autoCommit: true };

    const connection = await oracledb.getConnection();
    await connection.execute(sql, binds, options);
    await connection.close();
  },
};
