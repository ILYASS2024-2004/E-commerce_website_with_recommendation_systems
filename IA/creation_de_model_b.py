import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import datetime as dt
import pickle
import os
import mysql.connector
from mysql.connector import Error

# Machine Learning
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

print(" Lancement : Création Modèle RFM ")

# 1. CONFIGURATION BDD 
config_db = {
    'host': '127.0.0.1', 'user': 'root', 'password': '', 'database': 'ecommerce_clothes'
}

# 2. CHARGEMENT  (SQL) 
# Pour le RFM, on a besoin des Dates et des Prix !
print("Chargement des données depuis MySQL...")
try:
    db = mysql.connector.connect(**config_db)
    cursor = db.cursor(dictionary=True)
    
    query = """
    SELECT 
        c.id_client, 
        c.id_commande,
        c.date_commande,    
        p.sku,
        ci.quantite,
        p.prix              
    FROM commande_items ci
    JOIN commandes c ON ci.id_commande = c.id_commande
    JOIN produit p ON ci.id_produit = p.id_prod
    WHERE c.id_client IS NOT NULL
    """
    cursor.execute(query)
    data = cursor.fetchall()
    
    if not data: raise Exception("Aucune donnée trouvée.")
    
    df = pd.DataFrame(data)
    print(f"Données chargées : {df.shape[0]} lignes.")

except Error as e:
    print(f"Erreur SQL: {e}")
    exit()
finally:
    if 'db' in locals() and db.is_connected(): cursor.close(); db.close()

#  3. NETTOYAGE & PRÉPARATION 
print("Nettoyage et Calculs...")

# Conversion types
df['date_commande'] = pd.to_datetime(df['date_commande'])
df['quantite'] = pd.to_numeric(df['quantite'])
df['prix'] = pd.to_numeric(df['prix'])

# Nettoyage (Uniquement positif)
df = df[(df['quantite'] > 0) & (df['prix'] > 0)]

# Calcul du Montant Total par ligne
df['TotalPrice'] = df['quantite'] * df['prix']

# 4. CALCUL DE LA MATRICE RFM 
print("Construction de la matrice RFM...")

reference_date = df['date_commande'].max() + dt.timedelta(days=1)

rfm = df.groupby('id_client').agg({
    'date_commande': lambda x: (reference_date - x.max()).days, # Récence
    'id_commande': 'nunique',                                   # Fréquence
    'TotalPrice': 'sum'                                         # Monetary
}).reset_index()

rfm.rename(columns={
    'date_commande': 'Recency',
    'id_commande': 'Frequency',
    'TotalPrice': 'Monetary'
}, inplace=True)

# 5. TRANSFORMATION MATHÉMATIQUE (Log + Scaler) 
#On gère les outliers via Logarithme

# Log Transformation (np.log1p)
rfm_log = rfm[['Recency', 'Frequency', 'Monetary']].apply(np.log1p)

# Standardisation (Z-Score)
scaler = StandardScaler()
rfm_scaled = scaler.fit_transform(rfm_log)
rfm_scaled_df = pd.DataFrame(rfm_scaled, columns=rfm_log.columns)

#6. RECHERCHE AUTOMATIQUE DU MEILLEUR K 
print("Recherche du meilleur nombre de clusters (Silhouette)...")

best_score = -1
best_k = 4 # Valeur par défaut si échec
range_n_clusters = range(2, 10)

for n_clusters in range_n_clusters:
    kmeans_test = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    cluster_labels = kmeans_test.fit_predict(rfm_scaled_df)
    
    score = silhouette_score(rfm_scaled_df, cluster_labels)
    print(f"   K={n_clusters} -> Silhouette: {score:.4f}")
    
    if score > best_score:
        best_score = score
        best_k = n_clusters

# Logique Métier : Si le meilleur K est 2, on force souvent 4 pour avoir plus de nuances
if best_k < 3:
    print(f"K={best_k} mathématiquement optimal mais trop simple. On force K=4 pour le Business.")
    best_k = 4
else:
    print(f"Meilleur K retenu : {best_k}")

# 7. ENTRAÎNEMENT FINAL 
print(f"Entraînement final avec K={best_k}...")

final_kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
rfm['Cluster'] = final_kmeans.fit_predict(rfm_scaled_df)

# 8. CALCUL DES RECOMMANDATIONS (BEST SELLERS PAR CLUSTER) 
print("Calcul des produits populaires par Cluster...")

# On merge le Cluster avec les transactions brutes
df_merged = df.merge(rfm[['id_client', 'Cluster']], on='id_client', how='left')

# On compte les ventes par produit DANS chaque cluster
cluster_top_products = df_merged.groupby(['Cluster', 'sku'])['quantite'].sum().reset_index()
cluster_top_products = cluster_top_products.sort_values(by=['Cluster', 'quantite'], ascending=[True, False])

# On prépare un dictionnaire simple pour l'API {Cluster_ID: [Liste_Top_Produits]}
reco_dict = {}
for c in range(best_k):
    top_skus = cluster_top_products[cluster_top_products['Cluster'] == c]['sku'].head(20).tolist()
    reco_dict[c] = top_skus
    print(f"   Cluster {c} : {top_skus[:3]}...")

#9. SAUVEGARDE DU MODÈLE 
model_data = {
    'model': final_kmeans,      # Le modèle KMeans entraîné
    'scaler': scaler,           # Le Scaler pour transformer les futurs clients
    'rfm_data': rfm,            # La table avec les clusters assignés
    'reco_dict': reco_dict,     # Les listes de produits à recommander
    'description': "Modèle RFM (MySQL Data) avec Log Transform + K-Means"
}

file_name = 'model_rfm_sql.pkl'
with open(file_name, 'wb') as f:
    pickle.dump(model_data, f)

print(f"Terminé ! Modèle sauvegardé sous '{file_name}'")