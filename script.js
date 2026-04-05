const API = "https://Mozsell.v1.vercel.app";

// carregar produtos
async function loadProducts() {
  const res = await fetch(API + "/api/products");
  const products = await res.json();

  const container = document.getElementById("products");

  products.forEach(p => {
    container.innerHTML += `
      <div>
        <h3>${p.title}</h3>
        <p>${p.price} MZN</p>
      </div>
    `;
  });
}

loadProducts();
document.querySelector("#registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name,
    email,
    password
  })
});
  const data = await res.json();

  // guarda token
  localStorage.setItem("token", data.token);

  // vai direto para home
  window.location.href = "index.html";
});

document.querySelector("#sellForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Precisa fazer login");
    return;
  }

  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;

  await fetch(API + "/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({
      title,
      price,
      description
    })
  });

  alert("Produto publicado!");
  window.location.href = "index.html";
});
function togglePassword() {
  const pass = document.getElementById("password");

  pass.type = pass.type === "password" ? "text" : "password";
}
let isSubmitting = false;

document.querySelector("#loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) return; // 🔥 evita loop
  isSubmitting = true;

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";

  try {
    await fetch(API + "/api/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      errorMsg.textContent = "Email ou senha inválidos!";
      isSubmitting = false;
      return;
    }

    const data = await res.json();

    localStorage.setItem("token", data.token);

    // 🔥 redireciona só uma vez
    window.location.replace("index.html");

  } catch (err) {
    console.log(err);
    errorMsg.textContent = "Erro no servidor";
    isSubmitting = false;
  }
});