const connectDB = require("../config/db");
const oracledb = require("oracledb");

const UserModel = {
  async getAllUsers() {
    const connection = await connectDB();
    const result = await connection.execute(
      `SELECT * FROM Users`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT } // Return rows as objects
    );
    await connection.close();
    return result.rows;
  },

  async getUserById(userId) {
    const connection = await connectDB();
    try {
      const result = await connection.execute(
        `SELECT * FROM Users WHERE UserID = :id`,
        { id: userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      console.log("Query Result in getUserById:", result.rows); // Debug log
  
      return result.rows[0];
    } catch (error) {
      console.error("Error in getUserById:", error.message);
      throw error;
    } finally {
      await connection.close();
    }
  },

  async getUserByEmail(email) {
    const connection = await connectDB();
    const result = await connection.execute(
      `SELECT * FROM Users WHERE Email = :email`,
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    return result.rows[0];
  },

  async createUser(name, email, password, userType) {
    const connection = await connectDB();
    try {
      const result = await connection.execute(
        `INSERT INTO Users (UserID, Name, Email, Password, user_type)
         VALUES (user_id_seq.NEXTVAL, :name, :email, :password, :userType)
         RETURNING UserID INTO :newUserId`,
        {
          name,
          email,
          password,
          userType,
          newUserId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, // Bind for returning UserID
        },
        { autoCommit: true }
      );

      return result.outBinds.newUserId[0]; // Return the generated UserID
    } catch (err) {
      if (err.errorNum === 1) {
        throw new Error("Email already exists");
      } else {
        throw err;
      }
    } finally {
      await connection.close();
    }
  },

  async createLawyer(lawyerId, specialization, experienceYears) {
    const connection = await connectDB();
    try {
      await connection.execute(
        `INSERT INTO Lawyers (LawyerID, Specialization, ExperienceYears)
         VALUES (:lawyerId, :specialization, :experienceYears)`,
        {
          lawyerId, // Corresponds to UserID of the lawyer
          specialization, // Specialization of the lawyer
          experienceYears, // Experience in years
        },
        { autoCommit: true }
      );
    } catch (err) {
      throw err;
    } finally {
      await connection.close();
    }
  },

  async createLawStudent(studentId, educationalInstitute) {
    const connection = await connectDB();
    try {
      await connection.execute(
        `INSERT INTO LawStudents (StudentId, EducationalInstitute)
         VALUES (:studentId, :educationalInstitute)`,
        {
          studentId, // Corresponds to UserID of the law student
          educationalInstitute, // Educational institute of the student
        },
        { autoCommit: true }
      );
    } catch (err) {
      throw err;
    } finally {
      await connection.close();
    }
  },

  async deleteUser(userId) {
    const connection = await connectDB();
    try {
      await connection.execute(
        `DELETE FROM Users WHERE UserID = :id`,
        [userId],
        { autoCommit: true }
      );
    } finally {
      await connection.close();
    }
  },

  async getAllLawyers() {
    const connection = await connectDB();
    const result = await connection.execute(
      `SELECT UserID, Name FROM Users WHERE USER_TYPE = 'Lawyer'`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    return result.rows; // Return only the lawyers
  },

  async updateUserById(userId, updateData, userType) {
    const connection = await connectDB();
    try {
      // Update Users Table
      const userUpdates = [];
      const userBinds = { userId };
  
      if (updateData.name) {
        userUpdates.push("Name = :name");
        userBinds.name = updateData.name;
      }
      if (updateData.password) {
        userUpdates.push("Password = :password");
        userBinds.password = updateData.password; // Ensure password is hashed before passing
      }
  
      if (userUpdates.length) {
        const userSql = `UPDATE Users SET ${userUpdates.join(", ")} WHERE UserID = :userId`;
        await connection.execute(userSql, userBinds, { autoCommit: false });
      }
  
      // Update Lawyers Table
      if (userType === "Lawyer" && (updateData.specialization || updateData.experienceYears)) {
        const lawyerUpdates = [];
        const lawyerBinds = { userId };
  
        if (updateData.specialization) {
          lawyerUpdates.push("Specialization = :specialization");
          lawyerBinds.specialization = updateData.specialization;
        }
        if (updateData.experienceYears) {
          lawyerUpdates.push("ExperienceYears = :experienceYears");
          lawyerBinds.experienceYears = updateData.experienceYears;
        }
  
        if (lawyerUpdates.length) {
          const lawyerSql = `UPDATE Lawyers SET ${lawyerUpdates.join(", ")} WHERE LawyerID = :userId`;
          await connection.execute(lawyerSql, lawyerBinds, { autoCommit: false });
        }
      }
  
      // Update LawStudents Table
      if (userType === "LawStudent" && updateData.educationalInstitute) {
        const studentSql = `
          UPDATE LawStudents 
          SET EducationalInstitute = :educationalInstitute 
          WHERE StudentID = :userId
        `;
        await connection.execute(
          studentSql,
          { userId, educationalInstitute: updateData.educationalInstitute },
          { autoCommit: false }
        );
      }
  
      // Commit changes
      await connection.commit();
    } catch (error) {
      console.error("Error updating user by ID:", error.message);
      throw error;
    } finally {
      if (connection) await connection.close();
    }
  },
  
  async getLawStudentDetails(userId) {
    const connection = await connectDB();
    const result = await connection.execute(
      `SELECT EducationalInstitute 
       FROM LawStudents 
       WHERE StudentID = :userId`,
      { userId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    await connection.close();
    return result.rows[0];
  },
  async getLawyerDetails(userId) {
    const connection = await connectDB();
    try {
      const result = await connection.execute(
        `SELECT Specialization, ExperienceYears FROM Lawyers WHERE LawyerID = :userId`,
        { userId },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      return result.rows[0];
    } finally {
      await connection.close();
    }
  },
  
};

module.exports = UserModel;
