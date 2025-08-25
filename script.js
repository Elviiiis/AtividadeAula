// Elementos do DOM
const loginForm = document.getElementById("loginForm")
const registerForm = document.getElementById("registerForm")
const userArea = document.getElementById("userArea")
const loginFormElement = document.getElementById("loginFormElement")
const registerFormElement = document.getElementById("registerFormElement")
const showRegisterLink = document.getElementById("showRegister")
const showLoginLink = document.getElementById("showLogin")
const logoutBtn = document.getElementById("logoutBtn")
const welcomeMessage = document.getElementById("welcomeMessage")

// Verificar se usuário já está logado ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  checkLoginStatus()
})

// Alternar entre formulários
showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault()
  showRegisterForm()
})

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault()
  showLoginForm()
})

// Formulário de login
loginFormElement.addEventListener("submit", (e) => {
  e.preventDefault()

  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  if (validateLogin(email, password)) {
    setLoggedIn(email)
    showUserArea(email)
    showMessage("Login realizado com sucesso!", "success")
  } else {
    showMessage("Email ou senha incorretos!", "error")
  }
})

// Formulário de cadastro
registerFormElement.addEventListener("submit", (e) => {
  e.preventDefault()

  const name = document.getElementById("registerName").value
  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  // Validações
  if (password !== confirmPassword) {
    showMessage("As senhas não coincidem!", "error")
    return
  }

  if (password.length < 6) {
    showMessage("A senha deve ter pelo menos 6 caracteres!", "error")
    return
  }

  if (emailExists(email)) {
    showMessage("Este email já está cadastrado!", "error")
    return
  }

  // Cadastrar usuário
  if (registerUser(name, email, password)) {
    showMessage("Cadastro realizado com sucesso! Faça login.", "success")
    showLoginForm()
    // Limpar formulário
    registerFormElement.reset()
  } else {
    showMessage("Erro ao cadastrar usuário!", "error")
  }
})

// Logout
logoutBtn.addEventListener("click", () => {
  logout()
  showLoginForm()
  showMessage("Logout realizado com sucesso!", "success")
})

// Funções

function showLoginForm() {
  loginForm.classList.add("active")
  registerForm.classList.remove("active")
  userArea.classList.remove("active")
  hideMessage()
}

function showRegisterForm() {
  registerForm.classList.add("active")
  loginForm.classList.remove("active")
  userArea.classList.remove("active")
  hideMessage()
}

function showUserArea(email) {
  userArea.classList.add("active")
  loginForm.classList.remove("active")
  registerForm.classList.remove("active")

  const users = getUsers()
  const user = users.find((u) => u.email === email)
  welcomeMessage.textContent = `Olá, ${user.name}! Você está logado.`
}

function registerUser(name, email, password) {
  try {
    const users = getUsers()
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password, // Em produção, use hash da senha
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    return true
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error)
    return false
  }
}

function validateLogin(email, password) {
  const users = getUsers()
  return users.some((user) => user.email === email && user.password === password)
}

function emailExists(email) {
  const users = getUsers()
  return users.some((user) => user.email === email)
}

function getUsers() {
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

function setLoggedIn(email) {
  localStorage.setItem("currentUser", email)
  localStorage.setItem("isLoggedIn", "true")
  localStorage.setItem("loginTime", new Date().toISOString())
}
console.log(currentUser)

function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const currentUser = localStorage.getItem("currentUser")

  if (isLoggedIn === "true" && currentUser) {
    showUserArea(currentUser)
  } else {
    showLoginForm()
  }
}

function logout() {
  localStorage.removeItem("currentUser")
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("loginTime")
}

function showMessage(text, type) {
  messageDiv.textContent = text
  messageDiv.className = `message ${type}`

  // Esconder mensagem após 5 segundos
  setTimeout(() => {
    hideMessage()
  }, 5000)
}

function hideMessage() {
  messageDiv.style.display = "none"
  messageDiv.className = "message"
}
