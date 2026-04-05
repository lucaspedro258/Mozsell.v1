import clientPromise from "../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Use POST" });
  }

  const { email, password } = req.body;

  const client = await clientPromise;
  const db = client.db("mozsell");

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Utilizador não encontrado" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Password incorreta" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Login feito com sucesso",
    token
  });
}
