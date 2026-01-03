import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MessageSquare } from 'lucide-react';
import { Box, Paper, Typography, Link as MuiLink, Container } from '@mui/material';
import useAuthStore from '../../store/authStore';
import { Button, Input } from '../../components/common';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          width: '100%', 
          borderRadius: 4, 
          border: 1, 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          backgroundImage: 'none'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4, gap: 1 }}>
          <Box sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: 'rgba(37, 211, 102, 0.1)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'primary.main',
            mb: 2
          }}>
            <MessageSquare size={32} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight={700} align="center">
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Get started with WhatsApp campaigns
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 3, textAlign: 'center', bgcolor: 'rgba(255, 107, 107, 0.1)', p: 1.5, borderRadius: 1 }}>
              {error}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Input
              label="Name"
              type="text"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />

            <Button type="submit" loading={loading} fullWidth size="large" sx={{ mt: 1 }}>
              Create Account
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" color="primary" underline="hover" fontWeight={500}>
              Sign in
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
