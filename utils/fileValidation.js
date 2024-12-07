module.exports = {
  isValidFile: (file) => {
    const allowedTypes = ["PDF", "DOCX", "TXT", "JPEG", "PNG"];
    const fileType = file.mimetype.split("/")[1].toUpperCase();
    return allowedTypes.includes(fileType);
  },
};
