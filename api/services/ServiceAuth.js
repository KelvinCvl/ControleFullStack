const pool = require("../db");

module.exports = {
  findUserByEmailOrPseudo: (email, pseudo) => {
    return pool.query(
      "SELECT id FROM Utilisateur WHERE email = ? OR pseudo = ?",
      [email, pseudo]
    );
  },

  createUser: (pseudo, email, hash) => {
    return pool.query(
      "INSERT INTO Utilisateur (pseudo, email, motdepasse) VALUES (?, ?, ?)",
      [pseudo, email, hash]
    );
  },

  findUserByEmail: (email) => {
    return pool.query("SELECT * FROM Utilisateur WHERE email = ?", [email]);
  }
};
