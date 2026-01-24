# 🔧 Configuration du Déploiement FTP Automatique (Plan B)

## Si le Git de Hostinger ne fonctionne pas, utilise cette méthode

J'ai créé un système qui déploie automatiquement via FTP quand je push sur GitHub.

---

## Étape 1 : Récupérer tes informations FTP Hostinger

1. Connecte-toi à **hPanel Hostinger**
2. Va dans **Fichiers** → **Gestionnaire de fichiers** ou **FTP Accounts**
3. Note ces 3 informations :
   - **Serveur FTP** : `ftp.votre-domaine.com` (ou adresse IP)
   - **Nom d'utilisateur** : `u123456789` (ton username FTP)
   - **Mot de passe** : (ton password FTP)

---

## Étape 2 : Configurer les Secrets GitHub

1. Va sur **https://github.com/Puuuple/JLB**
2. Clique sur **Settings** (en haut)
3. Dans le menu de gauche : **Secrets and variables** → **Actions**
4. Clique sur **"New repository secret"**

Crée ces 3 secrets :

### Secret 1 : FTP_SERVER
- **Name** : `FTP_SERVER`
- **Secret** : `ftp.votre-domaine.com` (ton serveur FTP)
- Clique **Add secret**

### Secret 2 : FTP_USERNAME
- **Name** : `FTP_USERNAME`
- **Secret** : `u123456789` (ton username FTP)
- Clique **Add secret**

### Secret 3 : FTP_PASSWORD
- **Name** : `FTP_PASSWORD`
- **Secret** : (ton mot de passe FTP)
- Clique **Add secret**

---

## Étape 3 : C'est tout ! ✅

Maintenant, **chaque fois que je push sur GitHub** :
1. GitHub Actions se lance automatiquement
2. Récupère les derniers fichiers
3. Les envoie via FTP sur Hostinger
4. Le site est mis à jour en 1-2 minutes

---

## 🎯 Comment ça marche

```
Moi → Push GitHub → GitHub Actions → FTP vers Hostinger → Site mis à jour ✅
                     (déploiement automatique)
```

**Tu n'as RIEN à faire manuellement !**

---

## 📊 Vérifier que ça marche

1. Une fois les secrets configurés, je vais push un commit de test
2. Va sur **GitHub.com** → **Puuuple/JLB** → **Actions**
3. Tu verras le déploiement en cours (cercle jaune) puis ✅ vert quand c'est fait
4. Ton site sur Hostinger sera automatiquement mis à jour

---

## ⚠️ Important

**NE PARTAGE JAMAIS** tes credentials FTP publiquement. Les secrets GitHub sont sécurisés et je ne peux pas les voir.

---

## 🆚 Git Deployment vs FTP Auto

| Méthode | Vitesse | Configuration |
|---|---|---|
| Git Hostinger | ⚡ 30 sec | Simple (si dispo) |
| FTP Auto GitHub | ⚡ 1-2 min | 5 min setup |

Les deux fonctionnent parfaitement. Essaie d'abord le Git Hostinger, utilise FTP en plan B.
