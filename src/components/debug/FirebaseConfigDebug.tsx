import React from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Alert } from '@mui/material';
import { auth, db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

/**
 * DEBUG COMPONENT: Firebase Configuration Checker
 *
 * This component helps diagnose Firebase connection issues by showing:
 * 1. Environment variable status
 * 2. Firebase initialization status
 * 3. Authentication status
 *
 * USAGE: Add this component temporarily to your app to debug production issues
 * IMPORTANT: Remove before deploying to production
 */
const FirebaseConfigDebug: React.FC = () => {
  const { user, loading } = useAuth();

  const config = {
    'API Key': process.env.REACT_APP_FIREBASE_API_KEY,
    'Auth Domain': process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    'Project ID': process.env.REACT_APP_FIREBASE_PROJECT_ID,
    'Storage Bucket': process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    'Messaging Sender ID': process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    'App ID': process.env.REACT_APP_FIREBASE_APP_ID,
  };

  const allConfigured = Object.values(config).every(v => v && v !== 'undefined');
  const firebaseInitialized = !!auth && !!db;
  const isAuthenticated = !!user;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        🔍 Firebase Configuration Diagnostics
      </Typography>

      {/* Overall Status */}
      <Alert severity={allConfigured && firebaseInitialized && isAuthenticated ? 'success' : 'error'} sx={{ mb: 3 }}>
        {allConfigured && firebaseInitialized && isAuthenticated
          ? '✅ All systems operational'
          : '❌ Configuration issues detected'}
      </Alert>

      {/* Environment Variables */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          1. Environment Variables
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {Object.entries(config).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell><strong>{key}</strong></TableCell>
                  <TableCell>
                    {value && value !== 'undefined' ? (
                      <span style={{ color: 'green' }}>✅ Configured</span>
                    ) : (
                      <span style={{ color: 'red' }}>❌ Missing</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <code style={{ fontSize: '0.8em', wordBreak: 'break-all' }}>
                      {value ? `${value.substring(0, 20)}...` : 'undefined'}
                    </code>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Firebase Initialization */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          2. Firebase Initialization
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>
            Auth SDK: {auth ? <span style={{ color: 'green' }}>✅ Initialized</span> : <span style={{ color: 'red' }}>❌ Not Initialized</span>}
          </Typography>
          <Typography>
            Firestore SDK: {db ? <span style={{ color: 'green' }}>✅ Initialized</span> : <span style={{ color: 'red' }}>❌ Not Initialized</span>}
          </Typography>
          <Typography>
            Project ID: <code>{auth?.app?.options?.projectId || 'Not Found'}</code>
          </Typography>
        </Box>
      </Paper>

      {/* Authentication Status */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          3. Authentication Status
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>
            Loading: {loading ? '⏳ Yes' : '✅ No'}
          </Typography>
          <Typography>
            User Authenticated: {isAuthenticated ? <span style={{ color: 'green' }}>✅ Yes</span> : <span style={{ color: 'red' }}>❌ No</span>}
          </Typography>
          {user && (
            <>
              <Typography>
                User Email: <code>{user.email}</code>
              </Typography>
              <Typography>
                User ID: <code>{user.uid}</code>
              </Typography>
            </>
          )}
        </Box>
      </Paper>

      {/* Recommendations */}
      <Paper sx={{ p: 2, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          💡 Next Steps
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          {!allConfigured && (
            <li>
              <Typography>
                <strong>Missing environment variables:</strong> Add all REACT_APP_FIREBASE_* variables to your Vercel project settings
              </Typography>
            </li>
          )}
          {!firebaseInitialized && (
            <li>
              <Typography>
                <strong>Firebase not initialized:</strong> Check console for initialization errors
              </Typography>
            </li>
          )}
          {!isAuthenticated && allConfigured && firebaseInitialized && (
            <li>
              <Typography>
                <strong>Not authenticated:</strong> Navigate to <code>/login</code> to sign in
              </Typography>
            </li>
          )}
          <li>
            <Typography>
              <strong>After fixing:</strong> Remove this debug component from production
            </Typography>
          </li>
        </Box>
      </Paper>
    </Box>
  );
};

export default FirebaseConfigDebug;
