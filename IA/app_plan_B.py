import pandas as pd
import numpy as np
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import datetime as dt

app = Flask(__name__)
CORS(app)

# Configuration BDD
config_db = { 
    'host': '127.0.0.1', 
    'user': 'root', 
    'password': '', 
    'database': 'ecommerce_clothes' 
}

print("Chargement du Modèle RFM ...")
try:
    # On charge le modèle RFM
  
    pack = pickle.load(open('model_rfm_sql.pkl', 'rb'))
    
    kmeans_model = pack['model']       # Le modèle KMeans
    scaler = pack['scaler']            # Le Scaler (IMPORTANT pour normaliser les nouveaux clients)
    cluster_recos = pack['reco_dict']  # Les best-sellers par cluster {0: [sku1, sku2], ...}
    
    print("Modèle RFM chargé avec succès.")
    
except FileNotFoundError:
    print("ERREUR : 'model_rfm_sql.pkl' introuvable.")
    exit()

def get_user_history_vector(user_id):
    """
    Récupère les achats du client depuis MySQL et calcule ses métriques RFM
    pour prédire son cluster en temps réel.
    """
    try:
        db = mysql.connector.connect(**config_db)
        cursor = db.cursor(dictionary=True)
        
        # 1. Récupérer l'historique brut (Dates, Prix, Quantités)
        # On a besoin de tout ça pour recalculer R, F, M
        query = """
        SELECT 
            c.date_commande, 
            c.id_commande,
            p.sku, 
            p.prix,
            ci.quantite
        FROM commande_items ci
        JOIN commandes c ON ci.id_commande = c.id_commande
        JOIN produit p ON ci.id_produit = p.id_prod
        WHERE c.id_client = %s
        """
        cursor.execute(query, (user_id,))
        history = cursor.fetchall()
        db.close()
        
        if not history:
            return None, set()

        # 2. Conversion en DataFrame pour calculs faciles
        df_user = pd.DataFrame(history)
        df_user['date_commande'] = pd.to_datetime(df_user['date_commande'])
        df_user['quantite'] = pd.to_numeric(df_user['quantite'])
        df_user['prix'] = pd.to_numeric(df_user['prix'])
        
        # Liste des SKUs déjà achetés (pour le filtrage final)
        bought_skus = set(df_user['sku'].unique())

        # 3. Calcul du RFM "Live"
        # Récence
        now = dt.datetime.now()
        recency = (now - df_user['date_commande'].max()).days
        
        # Fréquence (Nombre de commandes uniques)
        frequency = df_user['id_commande'].nunique()
        
        # Montant (Total dépensé)
        monetary = (df_user['quantite'] * df_user['prix']).sum()
        
        # 4. Création du Vecteur (DataFrame)
        rfm_vector = pd.DataFrame([[recency, frequency, monetary]], columns=['Recency', 'Frequency', 'Monetary'])
        
        # 5. Application des transformations (MÊMES que lors de l'entraînement)
        # Log Transform
        rfm_log = rfm_vector.apply(np.log1p)
        
        # Standardisation (avec le scaler chargé du pickle)
        rfm_scaled = scaler.transform(rfm_log)
        
        # On retourne le vecteur prêt pour KMeans et la liste des achats
        return rfm_scaled, bought_skus

    except Exception as e:
        print(f"Erreur SQL ou Calcul: {e}")
        return None, set()

# ROUTE 1 : Vérifier le statut (Est-ce qu'on peut recommander ?) 
@app.route('/recommend/check_user', methods=['GET'])
def check_user():
    try:
        user_id = int(request.args.get('user_id'))
        
        # On regarde juste si on arrive à calculer un vecteur RFM
        rfm_vector, bought = get_user_history_vector(user_id)
        
        can_recommend = rfm_vector is not None
        
        return jsonify({'exists': can_recommend})
        
    except:
        return jsonify({'exists': False})

# ROUTE 2 : Recommandation 
@app.route('/recommend/behavior', methods=['GET'])
def recommend():
    try:
        user_id = int(request.args.get('user_id'))
        
        # 1. Construire le vecteur RFM du client à la volée
        rfm_vector_scaled, bought_skus = get_user_history_vector(user_id)
        
        if rfm_vector_scaled is None:
             return jsonify({'error': 'Pas d\'historique, impossible de classer.'}), 404

        # 2. Prédire son Cluster (INFÉRENCE)
        # Le modèle place ce point RFM dans le cluster le plus proche
        predicted_cluster = int(kmeans_model.predict(rfm_vector_scaled)[0])
        
        print(f"Client {user_id} -> Profil RFM détecté -> Cluster {predicted_cluster}")
        
        # 3. Récupérer les Tops Produits de ce Cluster
        candidates = cluster_recos.get(predicted_cluster, [])
        
        # 4. Filtrer ce qu'il a déjà acheté
        recommendations = [sku for sku in candidates if sku not in bought_skus]
        
        # 5. Renvoyer les 10 premiers
        return jsonify({'recommendations': recommendations[:10]})

    except Exception as e:
        print(f"Erreur : {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)