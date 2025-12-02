const pool = require('../db'); 

const creerSignalement = async ({ histoire_id, utilisateur_id, raison }) => {
  console.log('🔵 Début creerSignalement');
  
  try {
    const sql = `INSERT INTO signalements (histoire_id, utilisateur_id, raison) VALUES (?, ?, ?)`;
    
    console.log('🔵 Avant query avec params:', [histoire_id, utilisateur_id, raison]);
    
    const [result] = await pool.query(sql, [histoire_id, utilisateur_id, raison]);
    
    console.log('✅ Insertion réussie:', result);
    console.log('✅ insertId:', result.insertId);
    
    return result.insertId;
    
  } catch (err) {
    console.error('❌ Erreur SQL:', err);
    throw err;
  }
};

module.exports = { creerSignalement };