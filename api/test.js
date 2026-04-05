export default function handler(req, res) {
  console.log(process.env.MONGODB_URI);

  res.status(200).json({
    message: "Verificar consola da Vercel"
  });
}
