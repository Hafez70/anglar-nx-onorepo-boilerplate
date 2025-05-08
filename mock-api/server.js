const jsonServer = require('json-server');
const server = jsonServer.create();
const path = require('path');
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.bodyParser);

server.get('/api/My/zone', (req, res) => {
  const zone = router.db.get('myZone').value();
  if (!zone) {
    return res.status(500).json({ valid: false, message: 'No zone found' });
  }
  return res.json(zone);
});

server.get('/api/My/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  const authRecord = router.db.get('authentication').find({ token }).value();

  if (authRecord && authRecord.valid) {
    return res.json({ ...authRecord.profile });
  } else {
    return res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

// Login endpoint
server.post('/api/Account/login', (req, res) => {
  const { email, password } = req.body;
  const db = router.db;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // In a real app, you would hash passwords. For mock, we'll accept any password.
  const user = db.get('users').find({ email }).value();

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Get the complete profile entity
  const profile = db.get('profiles').find({ userId: user.id }).value();
  const authInfo = db.get('authentication').find({ userId: user.id }).value();

  if (!authInfo) {
    return res.status(500).json({ message: 'Authentication record not found' });
  }

  // Return a response that matches the AuthResponse interface
  const authResponse = {
    profile: profile, // IProfileEntity
    token: authInfo.token,
    refreshToken: authInfo.refreshToken,
  };

  res.json(authResponse);
});

// Validate token endpoint
server.get('/api/Account/validate-token', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ valid: false, message: 'No token provided' });
  }

  const authRecord = router.db.get('authentication').find({ token }).value();

  if (authRecord && authRecord.valid) {
    return res.json({ valid: true });
  } else {
    return res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

// Refresh token endpoint
server.post('/api/Account/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  const authRecord = router.db
    .get('authentication')
    .find({ refreshToken })
    .value();

  if (authRecord && authRecord.valid) {
    return res.json({
      token: authRecord.token, // In a real app, you'd generate a new token
      refreshToken: authRecord.refreshToken,
    });
  } else {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// Logout endpoint
server.post('/api/Account/logout', (req, res) => {
  // In a real app, you would invalidate the token here
  res.json({ success: true, message: 'Logged out successfully' });
});

// Map users endpoint to make it consistent
server.use('/api/users', (req, res, next) => {
  // If request has an Authorization header with a valid token,
  // return the user associated with that token
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const authRecord = router.db.get('authentication').find({ token }).value();
    if (authRecord) {
      const user = router.db
        .get('users')
        .find({ id: authRecord.userId })
        .value();
      if (user) {
        return res.json(user);
      }
    }
  }

  // Otherwise, continue to the default handler (which will return all users)
  next();
});

// Use default router
server.use(router);

// Start server
const port = 3000;
server.listen(port, () => {
  console.log(`JSON Server with authentication is running on port ${port}`);
  console.log(
    `Test login with: curl -X POST http://localhost:${port}/api/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"anypassword"}'`
  );
});
