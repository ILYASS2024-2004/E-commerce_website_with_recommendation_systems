const dbPool = require('../config/db');
const axios = require('axios');

// L'URL du microservice IA Plan B (API Python sur le port 5001)
const PLAN_B_API_URL = 'http://localhost:5001/recommend/behavior';
const PLAN_B_CHECK_URL = 'http://localhost:5001/recommend/check_user';

/**
 * Obtenir les recommandations Plan B (Basé sur le Clustering Comportemental)
 * @route   GET /api/recommend/b
 * @access  Private (Nécessite authGuard)
 */
exports.getPlanBRecommendations = async (req, res) => {
  // 1. Obtenir l'ID de l'utilisateur (depuis le token JWT)
  const id_client = req.user.id;

  if (!id_client) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  let recommendedSkus = [];

  // --- Étape 1 : Appeler l'API IA (Python Flask) ---
  try {
    const aiResponse = await axios.get(PLAN_B_API_URL, {
      params: { user_id: id_client }
    });
    
    // Le Clustering renvoie une liste de best-sellers pour le groupe du client
    recommendedSkus = aiResponse.data.recommendations; 

    // Si la liste est vide ou null
    if (!recommendedSkus || recommendedSkus.length === 0) {
      return res.status(200).json([]);
    }

  } catch (error) {
    // Si l'API Python renvoie 404 (Pas assez d'historique pour classer)
    // ou 500 (Erreur serveur), on renvoie une liste vide proprement.
    // Cela évite de faire planter le Frontend.
    console.warn(`Plan B (Clustering) info pour user ${id_client}: ${error.message}`);
    return res.status(200).json([]); 
  }

  // --- Étape 2 : "Hydrater" les SKUs avec la BDD MySQL ---
  try {
    // Créer les points d'interrogation pour la requête SQL (ex: "?,?,?")
    const placeholders = recommendedSkus.map(() => '?').join(',');

    // IMPORTANT : On utilise ORDER BY FIND_IN_SET pour respecter
    // l'ordre de pertinence renvoyé par le Clustering (les top produits d'abord)
    const sql = `
      SELECT * FROM produit 
      WHERE sku IN (${placeholders})
      ORDER BY FIND_IN_SET(sku, ?)
    `;
    
    // On passe les SKUs pour le IN et la chaîne de SKUs pour le FIND_IN_SET
    const params = [...recommendedSkus, recommendedSkus.join(',')];
    
    const [products] = await dbPool.query(sql, params);
    
    res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching recommended products from DB:', error);
    res.status(500).json({ message: 'Server error while fetching product details.' });
  }
};

/**
 * Vérifier si l'utilisateur peut être classé par le modèle (Clustering)
 * @route   GET /api/recommend/b/status
 * @access  Private
 */
exports.checkPlanBStatus = async (req, res) => {
  const id_client = req.user.id;

  try {
    // Appelle l'API Python pour savoir si le client a assez d'historique
    const response = await axios.get(PLAN_B_CHECK_URL, {
      params: { user_id: id_client }
    });

    // Renvoie { isTrained: true } si le client peut être classé
    res.status(200).json({ 
      isTrained: response.data.exists 
    });

  } catch (error) {
    // Si l'API est éteinte ou erreur, on dit "False" par sécurité
    console.error('Error checking Plan B status:', error.message);
    res.status(200).json({ isTrained: false });
  }
};