import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Switch, Chip, IconButton, Tooltip, Alert,
    Select, MenuItem, FormControl
} from '@mui/material';
import { Key as KeyIcon } from '@mui/icons-material';
import api from '../../api';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleActive = async (userId, currentStatus) => {
        setActionLoading(prev => ({ ...prev, [userId]: true }));
        try {
            const endpoint = currentStatus ? 'deactivate' : 'activate';
            await api.post(`/admin/users/${userId}/${endpoint}`);
            setUsers(users.map(u => 
                u.id === userId ? { ...u, isActive: !currentStatus } : u
            ));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update user status');
        } finally {
            setActionLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setActionLoading(prev => ({ ...prev, [`role_${userId}`]: true }));
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => 
                u.id === userId ? { ...u, role: newRole } : u
            ));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update role');
        } finally {
            setActionLoading(prev => ({ ...prev, [`role_${userId}`]: false }));
        }
    };

    const handleGenerateApiKey = async (userId) => {
        setActionLoading(prev => ({ ...prev, [`key_${userId}`]: true }));
        try {
            const response = await api.post(`/admin/users/${userId}/api-key`);
            if (response.data.success) {
                alert(`API Key generated: ${response.data.data.apiKey}\n\nCopy this now - it won't be shown again!`);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate API key');
        } finally {
            setActionLoading(prev => ({ ...prev, [`key_${userId}`]: false }));
        }
    };

    if (loading) {
        return <Typography>Loading users...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
                User Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Manage user accounts, roles, and access
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Role</strong></TableCell>
                            <TableCell align="center"><strong>Status</strong></TableCell>
                            <TableCell align="center"><strong>Active</strong></TableCell>
                            <TableCell align="center"><strong>API Key</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <FormControl size="small" sx={{ minWidth: 100 }}>
                                        <Select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={actionLoading[`role_${user.id}`]}
                                            sx={{ fontSize: '0.875rem' }}
                                        >
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="user">User</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                    <Chip 
                                        label={user.isActive ? 'Active' : 'Inactive'}
                                        color={user.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Switch
                                        checked={user.isActive ?? true}
                                        onChange={() => handleToggleActive(user.id, user.isActive ?? true)}
                                        disabled={actionLoading[user.id]}
                                        color="success"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Generate new API key">
                                        <IconButton 
                                            onClick={() => handleGenerateApiKey(user.id)}
                                            disabled={actionLoading[`key_${user.id}`]}
                                            size="small"
                                        >
                                            <KeyIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
