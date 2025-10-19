// TEMPORARY CORS FIX - Use this for immediate testing
// Replace the current CORS configuration in server.mjs with this:

app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
}));

// IMPORTANT: This allows ALL origins. Only use for testing!
// Replace with the proper configuration after confirming it works.
