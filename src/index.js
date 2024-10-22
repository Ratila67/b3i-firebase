// npm init -y permet de génerer le package.json
// npm run dev permet de lancer le programme et d'avoir les changements en temps réel, control + C pour stoper

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import 'dotenv/config';

// import la DB firebase
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
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
const afficheFactures = (factures) => {                 // Creation de la fonction afficheFactures
  const rootEl = document.querySelector('#root');       // Récupération de l'élément HTML. Cette ligne de code déclare une variable constante rootEl et lui assigne l'élément HTML qui a l'ID root dans le document courant, sélectionné à l'aide de la méthode document.querySelector.
  const ulEl = document.createElement('ul');            // On créé une fonction et on lui mets un ul
  factures.forEach(facture => {                         // On fait une boucle, on peut aussi résumé par factures.map(facture =>
    const liEl = document.createElement('li');          // On créé une fonction et on lui mets un li
    liEl.innerHTML = facture.id + "<button class='supprimerFacture' data-id='"+facture.id+"'>x</button>";                        // On rajoute le l'id de la facture dans liEl
    ulEl.appendChild(liEl);                             // En résumé, la ligne ulEl.appendChild(liEl) ajoute l'élément de liste liEl (qui contient l'identifiant d'une facture) à l'élément de liste non ordonnée ulEl. Cela signifie que chaque fois que cette ligne est exécutée dans la boucle, un nouvel élément de liste sera ajouté à la liste affichée sur la page web.
  })
rootEl.appendChild(ulEl);                               // On rajoute 
};

//Supression de factures
const buttonsDelete = document.querySelectorAll('.supprimerFacture');
buttonsDelete.forEach(button => {
  button.addEventListener('click', async (event) => {
    const idFacture = event.target.dataset.id;          // Récupere l'ID
    await deleteDoc(doc(db, 'factures', idFacture));

    console.log('click');
    console.log(event.target.dataset.id);               // l'idée c'est de quand on appui sur le bouton ça suppr dans la base de données;
    
    //Actualisation des factures affichés
    const updateFactures = await getFactures(db);
    const rootEl = document.querySelector('#root');
    rootEl.innerHTML = ''; // On vide la page
    afficheFactures(updateFactures);
  })
});
afficheFactures(factures);

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
