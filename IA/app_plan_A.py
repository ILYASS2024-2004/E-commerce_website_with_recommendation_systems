import pandas as pd
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

#  Initialisation de l'application Flask 
app = Flask(__name__)
CORS(app) 

print("Chargement des modèles TECH (Plan A), veuillez patienter...")

# Chargement des NOUVEAUX fichiers .pkl 

try:
    matrix = pickle.load(open('similarity_matrix.pkl', 'rb'))
    # 'products' est maintenant un DataFrame complet
    products_df = pickle.load(open('products_list.pkl', 'rb')) 
except FileNotFoundError:
    print("ERREUR : Fichiers '..._.pkl' introuvables.")
    print("Veuillez d'abord exécuter le script .")
    exit()

# Création de l'index de correspondance (avec 'sku') 
# Créer un index pour trouver un produit par son 'sku'
# (Ex: indices['TEC-PH-001'] -> 0)
indices = pd.Series(products_df.index, index=products_df['sku'])

print("Serveur (Plan A ) prêt !")


# Définition de la route API 
@app.route('/recommend/content', methods=['GET'])
def recommend_content():
    
    # Obtenir le 'sku' depuis l'URL (au lieu de 'stock_code')
 
    sku_code = request.args.get('sku')
    
    # Validation de l'entrée 
    if not sku_code:
        return jsonify({'error': 'Le paramètre sku est manquant.'}), 400
        
    if sku_code not in indices:
        return jsonify({'error': f'SKU {sku_code} non trouvé.'}), 404
        
    try:
        #Logique de recommandation
      
        
        # Trouver l'index du produit (ex: 0)
        idx = indices[sku_code]
        
        # Obtenir les scores de similarité
        sim_scores = list(enumerate(matrix[idx]))
        
        # Trier les produits par score
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Obtenir les 10 meilleurs 7 (ignorer le 1er, c'est lui-même)
        sim_scores = sim_scores[1:7]
        
        #Récupérer les index de ces 10 produits
        product_indices = [i[0] for i in sim_scores]
        
        # Récupérer les 'sku' correspondants
        recommendations = products_df['sku'].iloc[product_indices].tolist()
        
        #Renvoyer la réponse en JSON
        return jsonify({'recommendations': recommendations})

    except Exception as e:
        return jsonify({'error': f'Erreur interne du serveur: {str(e)}'}), 500

# ancement du serveur 
if __name__ == '__main__':
    #le port 5000
    app.run(port=5000, debug=True)


















# import pandas as pd
# import pickle
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from sklearn.metrics.pairwise import linear_kernel # C'est le Cosinus rapide
# import mysql.connector

# app = Flask(__name__)
# CORS(app) 

# # Config DB (Pour les nouveaux produits)
# config_db = { 'host': '127.0.0.1', 'user': 'root', 'password': '', 'database': 'ecommerce_tech' }

# print("Chargement du Moteur Plan A (Cosinus Dynamique)...")
# try:
#     # On charge le moteur généré par train_plan_A_dynamic.py
#     engine = pickle.load(open('engine_plan_A.pkl', 'rb'))
#     tfidf_vectorizer = engine['vectorizer']
#     tfidf_matrix = engine['matrix']
#     df_products = engine['data']
    
#     # Indexation rapide
#     if 'sku' in df_products.columns:
#         df_products.set_index('sku', drop=False, inplace=True)
        
# except FileNotFoundError:
#     print("Erreur: Lancez d'abord le script 'train_plan_A_dynamic.py'.")
#     exit()

# def get_product_from_db(sku):
#     try:
#         db = mysql.connector.connect(**config_db)
#         cursor = db.cursor(dictionary=True)
#         cursor.execute("SELECT sku, description, categorie, nom FROM produit WHERE sku = %s", (sku,))
#         prod = cursor.fetchone()
#         db.close()
#         return prod
#     except: return None

# @app.route('/recommend/content', methods=['GET'])
# def recommend_content():
#     sku = request.args.get('sku')
#     if not sku: return jsonify({'error': 'SKU manquant'}), 400

#     target_vector = None

#     # CAS 1 : Produit CONNU (Déjà en mémoire)
#     if sku in df_products.index:
#         # On récupère son index numérique dans la matrice
#         idx = df_products.index.get_loc(sku)
#         # Gestion des doublons éventuels
#         if isinstance(idx, slice) or hasattr(idx, '__iter__'):
#              idx = idx[0]
             
#         target_vector = tfidf_matrix[idx]
#         # print(f"Produit {sku} trouvé en mémoire.")

#     # CAS 2 : Produit NOUVEAU (Pas en mémoire, mais dans MySQL)
#     else:
#         print(f"Produit {sku} inconnu -> Récupération MySQL...")
#         new_prod = get_product_from_db(sku)
        
#         if not new_prod:
#             return jsonify({'error': 'Produit introuvable'}), 404
            
#         # --- APPLIQUER LA MÊME FORMULE EXACTE ---
#         description = new_prod['description'] or ""
#         categorie = new_prod['categorie'] or ""
#         nom = new_prod['nom'] or ""
        
#         # Recréer le super-texte
#         text = description + (" " + categorie) * 5
        
#         # Transformer en vecteur mathématique à la volée
#         target_vector = tfidf_vectorizer.transform([text])

#     # --- CALCUL DE SIMILARITÉ (COSINUS) ---
#     # On compare ce vecteur avec TOUS les autres vecteurs de la base
#     # linear_kernel = Produit Scalaire (équivalent Cosinus sur TF-IDF normalisé)
#     cosine_scores = linear_kernel(target_vector, tfidf_matrix).flatten()
    
#     # Trier les scores (du plus grand au plus petit)
#     # argsort donne les indices, [::-1] inverse l'ordre
#     related_indices = cosine_scores.argsort()[::-1]
    
#     recommendations = []
#     for i in related_indices:
#         # On récupère le SKU correspondant à l'indice
#         rec_sku = df_products.iloc[i]['sku']
        
#         # On ne se recommande pas soi-même
#         if rec_sku != sku: 
#             recommendations.append(rec_sku)
            
#         # On s'arrête quand on en a 10
#         if len(recommendations) >= 10:
#             break
            
#     return jsonify({'recommendations': recommendations})

# if __name__ == '__main__':
#     app.run(port=5000, debug=True)