// npm init -y permet de génerer le package.json
// npm run dev permet de lancer le programme et d'avoir les changements en temps réel, control + C pour stoper

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import 'dotenv/config';

// import la DB firebase
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//pouir faire des affichage sous JS
console.log('Start du programme V1');

// Your web app's Firebase configuration (infos sensible dans le .env)
const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Recupération des données de la base de factures, le async permets de mettre des await, sinon await ne foncitonne pas
// const permet de creer une variable
// ALTERNATIVE AUJOURD'HUI    const getFactures = async (db) => {
async function getFactures(db) {
    const facturesCol = collection(db, 'factures');
    const facturesSnapshot = await getDocs(facturesCol);
    // On recré un objet parmis un objet qu'on avait deja, doc.data nous réucpéré toutes les info, l'id ne se trouve pas dans les data mais dans une propriété specifique, d'ou le doc.id
    // Les ... permet de créer un objet à partir de ce qui était avant
    const factures = facturesSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
    
    return factures;
  }
// on initialise factures et on lui mets await afin de garder le temps de récupérer les données
const factures = await getFactures(db)
// on affiche les données récups
// console.log(factures);


// Faire une verification pour si TotalTTC est présent, renvoyer l'id de la facture
factures.forEach(facture => {
  // Correction de la condition if et appel correct à parseFloat
  if (!isNaN(facture.totalTTC) && parseFloat(facture.totalTTC) > -10) {
    console.log(facture.id);
  }
});

// typeof permets d'afficher  le type de la variable
// parseFloat permets  de convertir en nombre
// isNaN permets  de vérifier si une valeur est un nombre
