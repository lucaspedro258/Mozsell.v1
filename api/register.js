import clientPromise from "../lib/mongodb";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Use POST" });
  }

  const { email, password } = req.body;

  const client = await clientPromise;
  const db = client.db("mozsell");

  const users = db.collection("users");

  // ver se já existe
  const exists = await users.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Conta já existe" });
  }

  // encriptar password
  const hashedPassword = await bcrypt.hash(password, 10);

  await users.insertOne({
    email,
    password: hashedPassword,
    createdAt: new Date()
  });

  return res.status(201).json({ message: "Conta criada com sucesso" });
}
