// npm init -y permet de génerer le package.json
// npm run dev permet de lancer le programme et d'avoir les changements en temps réel, control + C pour stoper

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import 'dotenv/config';

// import la DB firebase
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { onSnapshot, collection } from 'firebase/firestore';
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

// Écouteur de la collection "factures"
const listenToFactures = (db) => {
  const facturesCol = collection(db, 'factures');

  // Utilisation de onSnapshot pour écouter les changements
  onSnapshot(facturesCol, (snapshot) => {
    const factures = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    afficheFactures(factures); // Met à jour l'affichage des factures
  });
};

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

const afficheFactures = (factures) => {
  // Sélection de l'élément racine
  const rootEl = document.querySelector('#root');
  rootEl.innerHTML = ''; // Vide la page

  const ulEl = document.createElement('ul');            // Création d'un élément ul

  factures.forEach(facture => {                         // Boucle sur les factures
    const liEl = document.createElement('li');          // Création d'un élément li
    liEl.innerHTML = `${facture.id} <button class="supprimerFacture" data-id="${facture.id}">x</button>`;// Ajout du contenu au li
    ulEl.appendChild(liEl);                             // Ajout du li à l'ul
  });

  // Ajout de l'ul à la page
  rootEl.appendChild(ulEl);

  // Sélection des boutons de suppression
  const buttonsDelete = document.querySelectorAll('.supprimerFacture');

  buttonsDelete.forEach(button => {                                     // Ajout d'un événement sur chaque bouton
    button.addEventListener('click', async (event) => {
      if (confirm('Etes-vous sûr de supprimer cette facture ?')) {      // Confirmation de suppression
        const idFacture = event.target.dataset.id;                      // Récupération de l'ID de la facture
        try {
          await deleteDoc(doc(db, 'factures', idFacture));              // Suppression de la facture
          console.log(`Facture avec ID ${idFacture} supprimée.`);
        } catch (error) {                                               // Gestion de l'erreur
          console.error(`Erreur lors de la suppression de la facture avec ID ${idFacture} :`, error);
        }
      }
    });
  });
};
    afficheFactures(factures);                            // On appelle la fonction afficheFactures

//Ajout de nouvelles factures
const formEl = document.querySelector('#formAdd form');
formEl.addEventListener('submit', async (event) => {
  event.preventDefault();                               // prevent default sert à empecher le comportement par défaut et donc ici l'empeche de rafraichir
  
  const inputValue1 = event.target[0].value;            // récupere la value 1
  const inputValue2 = event.target[1].value;            // récupere la value 2

  addDoc(collection(db,'factures'),{                    // L'insert dans la DB
    number: inputValue1,
    totalTTC: inputValue2
  });
  console.log('Sumbit and form'), event.target[0].value, event.target[1].value;

  //Actualisation des factures affichés
  const updateFactures = await getFactures(db);
  const rootEl = document.querySelector('#root');
  rootEl.innerHTML = ''; // On vide la page
  afficheFactures(updateFactures);
});
