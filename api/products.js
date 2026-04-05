import clientPromise from "../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("mozsell");

  const products = db.collection("products");

  if (req.method === "GET") {
    const data = await products.find({}).toArray();
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const product = req.body;

    await products.insertOne({
      ...product,
      createdAt: new Date()
    });

    return res.status(201).json({ message: "Produto criado" });
  }

  return res.status(405).json({ message: "Método não permitido" });
}
