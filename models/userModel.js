const connectDB = require('../config/db');
const oracledb = require('oracledb')

const UserModel = {
    async getAllUsers() {
        const connection = await connectDB();
        const result = await connection.execute(`SELECT * FROM Users`, [], {
            outFormat: oracledb.OUT_FORMAT_OBJECT, // Return rows as objects
        });
        await connection.close();
        return result.rows;
    },

    async getUserById(userId) {
        const connection = await connectDB();
        const result = await connection.execute(
            `SELECT * FROM Users WHERE UserID = :id`,
            [userId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        await connection.close();
        return result.rows[0];
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
                throw new Error('Email already exists');
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
                    lawyerId,         // Corresponds to UserID of the lawyer
                    specialization,   // Specialization of the lawyer
                    experienceYears,  // Experience in years
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
                 VALUES (:studentID, :educationalInstitute)`,
                {
                    studentId,         // Corresponds to UserID of the lawyer
                    educationalInstitute,   // Specialization of the lawyer
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
        await connection.execute(
            `DELETE FROM Users WHERE UserID = :id`,
            [userId],
            { autoCommit: true }
        );
        await connection.close();
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
};

module.exports = UserModel;
