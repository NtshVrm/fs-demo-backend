const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  setDoc,
} = require("firebase/firestore");

const express = require("express");
const app = express();
const cors = require("cors");
const products = require("./products");

const PORT = 5000;

app.use(async (req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  res.header({ "Access-Control-Allow-Headers": "*" });
  res.header({ "Access-Control-Allow-Methods": "*" });
  next();
});
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const firebaseConfig = {
  apiKey: "AIzaSyD0QZ76EsYz8s566A6js3S0jLCi1TVYubg",
  authDomain: "fullstack-demo-3f62c.firebaseapp.com",
  projectId: "fullstack-demo-3f62c",
  storageBucket: "fullstack-demo-3f62c.appspot.com",
  messagingSenderId: "623251543660",
  appId: "1:623251543660:web:cff6c08878861f6c5f6a49",
  measurementId: "G-QZ1VGRNJWF",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function getItems(db, collectionName) {
  const productsCol = collection(db, collectionName);
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map((doc) => doc.data());
  return productList;
}

async function setProducts(db, docName, data) {
  await setDoc(doc(db, "products", String(docName)), data);
  console.log("Product Added with ID :", docName);
}

async function setCart(db, docName, data) {
  await setDoc(doc(db, "cart", String(docName)), data);
  console.log("Product Added with ID :", docName);
}

async function deleteCart(db, docId) {
  await deleteDoc(doc(db, "cart", docId));
  console.log("Document deleted with ID: ", docId);
}

// products.map((prod) => {
//   setProducts(db, prod.id, prod);
// });

app.get("/api", (req, res) => {
  res.json({ status: 200, statusText: "OK" });
});

app.get("/api/products", (req, res) => {
  getItems(db, "products").then((response) => {
    res.json(response);
  });
});

app.post("/api/products", (req, res) => {
  setProducts(db, req.body.id, req.body);
});

app.get("/api/cart", (req, res) => {
  getItems(db, "cart").then((response) => {
    res.json(response);
  });
});

app.post("/api/cart", (req, res) => {
  setCart(db, req.body.id, req.body);
});

app.delete("/api/cart", (req, res) => {
  deleteCart(db, req.body.id);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

module.exports = app;
