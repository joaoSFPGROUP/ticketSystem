document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form') as HTMLFormElement;
  const nomeInput = document.getElementById('username') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button during request
    submitButton.disabled = true;
    submitButton.textContent = 'Autenticando...';

    const credentials = {
      nome: nomeInput.value.trim(),
      password: passwordInput.value.trim()
    };

    if (!credentials.nome || !credentials.password) {
      showError('Preencha todos os campos!');
      resetFormState();
      nomeInput.focus();
      return;
    }

    try {
      const response = await fetch('http://192.168.1.14:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciais inválidas');
      }

      handleSuccessfulLogin(data);
      
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erro na autenticação');
    } finally {
      resetFormState();
    }
  });

  function handleSuccessfulLogin(data: any) {
    const { ipcRenderer } = require('electron');
    const { user } = data;
    
    if (user?.permissions === "admin") {
      console.log("Admin Login", user);
      ipcRenderer.send('login-success-admin', user);
    } else {
      console.log("User Login", user);
      ipcRenderer.send('login-success-user', user);
    }
  
    sessionStorage.setItem('auth', JSON.stringify({
      id: user.id,
      nome: user.nome,
      permissions: user.permissions
    }));
  }

  function showError(message: string) {
    passwordInput.value = '';
    
    const errorElement = document.getElementById('login-error') || createErrorElement();
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    nomeInput.focus();
  }

  function createErrorElement(): HTMLElement {
    const element = document.createElement('div');
    element.id = 'login-error';
    element.style.color = '#ff4444';
    element.style.marginTop = '1rem';
    form.appendChild(element);
    return element;
  }

  function resetFormState() {
    submitButton.disabled = false;
    submitButton.textContent = 'Entrar';
  }
});