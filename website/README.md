# JLB Cuisine Bain et Agencement - Site Web

Site web professionnel pour JLB Cuisine Bain et Agencement, entreprise spécialisée dans les cuisines sur-mesure, salles de bain et agencement dans l'est lyonnais.

## 🎯 Fonctionnalités

- **Design élégant et moderne** : Interface professionnelle avec palette de couleurs raffinée
- **Système de prise de RDV en ligne** : Calendrier interactif avec sélection de créneaux horaires
- **Responsive** : Compatible mobile, tablette et desktop
- **SEO optimisé** : Meta tags et contenu optimisés pour le référencement local
- **Two types de RDV** :
  - Rendez-vous au showroom à Rillieux-la-Pape
  - Rendez-vous à domicile dans toute la zone d'intervention

## 📁 Structure du projet

```
website/
├── index.html          # Page principale (one-page)
├── css/
│   └── styles.css      # Styles CSS
├── js/
│   └── script.js       # JavaScript pour interactivité
├── images/             # Dossier pour vos images
└── README.md           # Documentation
```

## 🚀 Installation

1. Téléchargez tous les fichiers du site
2. Placez-les sur votre serveur web
3. Ouvrez `index.html` dans un navigateur

Aucune dépendance externe n'est requise. Le site fonctionne directement avec HTML, CSS et JavaScript vanilla.

## ⚙️ Configuration

### Informations à personnaliser

Ouvrez `index.html` et modifiez les sections suivantes selon vos besoins :

1. **Email de contact** (ligne ~485) :
   ```html
   <a href="mailto:contact@jlb-cuisine.fr">contact@jlb-cuisine.fr</a>
   ```

2. **Adresse du showroom** (ligne ~471) :
   ```html
   <p>Rillieux-la-Pape<br>Est Lyonnais</p>
   ```

3. **Horaires d'ouverture** (ligne ~477) :
   ```html
   <p>Lun - Ven : 9h - 18h<br>Sam : 9h - 17h<br>Dim : Sur rendez-vous</p>
   ```

### Ajouter des images

1. Ajoutez vos photos dans le dossier `images/`
2. Pour ajouter une image de fond au hero, modifiez le CSS (styles.css ligne ~190) :
   ```css
   .hero {
       background-image: url('../images/votre-image.jpg');
   }
   ```

## 📧 Configuration du système de RDV

Le système de réservation est actuellement en mode "frontend only". Les données sont affichées dans la console du navigateur.

### Pour activer l'envoi d'emails :

Vous avez plusieurs options :

#### Option 1 : Backend PHP (recommandé pour hébergement classique)

Créez un fichier `send-booking.php` :

```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);

    $to = "contact@jlb-cuisine.fr";
    $subject = "Nouvelle demande de RDV - JLB Cuisine";

    $message = "
    Nouvelle demande de rendez-vous

    Type: " . $data['rdvType'] . "
    Date: " . $data['date'] . "
    Heure: " . $data['time'] . "

    Client:
    Nom: " . $data['nom'] . "
    Téléphone: " . $data['telephone'] . "
    Email: " . $data['email'] . "
    Ville: " . $data['ville'] . "
    Adresse: " . $data['adresse'] . "

    Projet: " . $data['projet'] . "
    ";

    $headers = "From: noreply@jlb-cuisine.fr";

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>
```

Puis dans `js/script.js`, décommentez et modifiez la fonction `sendBookingNotification()` (ligne ~361).

#### Option 2 : Service tiers (FormSubmit, EmailJS, etc.)

1. Inscrivez-vous sur [FormSubmit.co](https://formsubit.co) ou [EmailJS](https://www.emailjs.com)
2. Suivez leurs instructions d'intégration
3. Modifiez la fonction `submitBooking()` pour envoyer à leur API

#### Option 3 : Google Forms / Sheets

Créez un Google Form et utilisez son endpoint pour envoyer les données.

## 🎨 Personnalisation des couleurs

Les couleurs sont définies dans `css/styles.css` (lignes 10-16) :

```css
:root {
    --primary-color: #1a2332;      /* Bleu marine foncé */
    --secondary-color: #c9a961;    /* Or/Doré */
    --accent-color: #8b7355;       /* Marron clair */
    --text-dark: #2c3e50;
    --text-light: #6c757d;
    --bg-light: #f8f9fa;
}
```

Modifiez ces valeurs pour changer la palette de couleurs du site.

## 📱 Zones d'intervention

Les villes sont listées dans deux endroits :

1. **Section "Zones d'intervention"** (index.html ligne ~227)
2. **Sélecteur de ville dans le formulaire RDV** (index.html ligne ~303)

Ajoutez ou supprimez des villes selon vos besoins.

## 🔧 Support et maintenance

### Navigateurs supportés

- Chrome (dernière version)
- Firefox (dernière version)
- Safari (dernière version)
- Edge (dernière version)
- Mobile browsers (iOS Safari, Chrome Android)

### Optimisations futures possibles

- Intégration Google Maps pour localiser le showroom
- Galerie photos de réalisations
- Témoignages clients
- Blog / Actualités
- Chat en direct
- Intégration réseaux sociaux

## 📞 Contact

Pour toute question sur le site web :
- Téléphone : 06 37 87 81 41
- Email : contact@jlb-cuisine.fr

## 📄 Licence

© 2026 JLB Cuisine Bain et Agencement. Tous droits réservés.

---

**Note importante** : Avant de mettre en production, n'oubliez pas de :
1. ✅ Tester le formulaire de contact
2. ✅ Vérifier tous les liens et numéros de téléphone
3. ✅ Ajouter vos vraies photos
4. ✅ Configurer l'envoi d'emails
5. ✅ Tester sur mobile
6. ✅ Optimiser les images pour le web
7. ✅ Configurer Google Analytics (optionnel)
