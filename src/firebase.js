



// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // ✅ Import Firebase Storage

// const firebaseConfig = {
//     apiKey: "AIzaSyA5n5iV7DZ4KHe5bZpnDLZa_wM7jn5sKgI",
//     authDomain: "stonehill-hackathon-f6fc5.firebaseapp.com",
//     projectId: "stonehill-hackathon-f6fc5",
//     storageBucket: "stonehill-hackathon-f6fc5.firebasestorage.app",
//     messagingSenderId: "332405995596",
//     appId: "1:332405995596:web:7ba83c520fb8b21ad71ce9"
//   };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyA5n5iV7DZ4KHe5bZpnDLZa_wM7jn5sKgI",
  authDomain: "stonehill-hackathon-f6fc5.firebaseapp.com",
  projectId: "stonehill-hackathon-f6fc5",
  storageBucket: "stonehill-hackathon-f6fc5.firebasestorage.app",
  messagingSenderId: "332405995596",
  appId: "1:332405995596:web:7ba83c520fb8b21ad71ce9"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize Firebase Storage

// ✅ Export Firestore (db) and Storage
export { db, storage };
