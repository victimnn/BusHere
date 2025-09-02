
const API_URL = 'http://localhost:3000/api/passenger/auth';

const testUser = {
  name: 'Test User',
  cpf: '12345678909',
  email: 'testuser@example.com',
  password: 'senha123',
  address: {
    street: 'Rua Teste',
    number: '123',
    complement: 'Apto 1',
    neighborhood: 'Centro',
    city: 'TestCity',
    state: 'SP',
    zip: '12345678'
  }
};

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

async function runTests() {
  let token;
  let userId;
  let password = testUser.password;

  // 1. Register
  try {
    const res = await fetchJson(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    console.log('Register:', res.data);
    userId = res.data.userId;
  } catch (err) {
    console.error('Register error:', err);
  }

  // 2. Login
  try {
    const res = await fetchJson(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password })
    });
    console.log('Login:', res.data);
    token = res.data.token;
  } catch (err) {
    console.error('Login error:', err);
    return;
  }

  // 3. Get Me
  try {
    const res = await fetchJson(`${API_URL}/me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Me:', res.data);
  } catch (err) {
    console.error('Me error:', err);
  }

  // 4. Change password several times
  for (let i = 0; i < 3; i++) {
    const newPassword = `senha${123 + i}`;
    try {
      const res = await fetchJson(`${API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ old_password: password, new_password: newPassword })
      });
      console.log(`Change password ${i + 1}:`, res.data);
      password = newPassword;
    } catch (err) {
      console.error(`Change password ${i + 1} error:`, err);
    }
    // Login again with new password
    try {
      const res = await fetchJson(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testUser.email, password })
      });
      console.log(`Login after password change ${i + 1}:`, res.data);
      token = res.data.token;
    } catch (err) {
      console.error(`Login after password change ${i + 1} error:`, err);
      break;
    }
  }

  // 5. Logout
  try {
    const res = await fetchJson(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Logout:', res.data);
  } catch (err) {
    console.error('Logout error:', err);
  }
}

runTests();
