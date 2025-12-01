const pool = require("../db"); 

async function saveProgression(utilisateur_id, histoire_id, page_id) {
  if (!utilisateur_id || !histoire_id || !page_id) {
    throw new Error("Paramètres invalides");
  }

  try {
    const [existing] = await pool.query(
      "SELECT * FROM progression WHERE utilisateur_id=? AND histoire_id=?",
      [utilisateur_id, histoire_id]
    );

    if (existing.length > 0) {
      await pool.query(
        "UPDATE progression SET page_id=?, date_modif=CURRENT_TIMESTAMP WHERE utilisateur_id=? AND histoire_id=?",
        [page_id, utilisateur_id, histoire_id]
      );
    } else {
      await pool.query(
        "INSERT INTO progression (utilisateur_id, histoire_id, page_id, date_modif) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
        [utilisateur_id, histoire_id, page_id]
      );
    }
  } catch (error) {
    console.error("Erreur SQL dans saveProgression:", error.message);
    throw error;
  }
}

async function resetProgression(utilisateur_id, histoire_id) {
  if (!utilisateur_id || !histoire_id) {
    throw new Error("Paramètres invalides");
  }
  
  try {
    await pool.query(
      "DELETE FROM progression WHERE utilisateur_id=? AND histoire_id=?",
      [utilisateur_id, histoire_id]
    );
    console.log(`Progression supprimée pour user ${utilisateur_id}, histoire ${histoire_id}`);
  } catch (error) {
    console.error("Erreur SQL dans resetProgression:", error.message);
    throw error;
  }
}

async function getLastPage(utilisateur_id, histoire_id) {
  if (!utilisateur_id || !histoire_id) {
    throw new Error("Paramètres invalides");
  }
  
  try {
    const [result] = await pool.query(
      "SELECT page_id FROM progression WHERE utilisateur_id=? AND histoire_id=?",
      [utilisateur_id, histoire_id]
    );
    return result.length > 0 ? result[0].page_id : null;
  } catch (error) {
    console.error("Erreur SQL dans getLastPage:", error.message);
    throw error;
  }
}

module.exports = {
  saveProgression,
  resetProgression,
  getLastPage,
};