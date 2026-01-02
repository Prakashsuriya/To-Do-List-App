
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { theme } from '../styles/theme';

const HomeScreen = ({ navigation }: any) => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTasks();
        }, [])
    );

    const handleDelete = async (id: string) => {
        Alert.alert('Delete Task', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    try {
                        await api.delete(`/tasks/${id}`);
                        fetchTasks(); // Refresh
                    } catch (e) {
                        Alert.alert('Error', 'Failed to delete task');
                    }
                }
            }
        ]);
    };

    const handleStatusToggle = async (task: any) => {
        try {
            await api.put(`/tasks/${task._id}`, {
                status: task.status === 'completed' ? 'pending' : 'completed'
            });
            fetchTasks();
        } catch (e) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return theme.colors.error;
            case 'medium': return theme.colors.secondary;
            default: return theme.colors.textSecondary;
        }
    };

    const smartSort = (taskList: any[]) => {
        return [...taskList].sort((a, b) => {
            // 1. Priority (High > Medium > Low)
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const pA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
            const pB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
            if (pA !== pB) return pB - pA;

            // 2. Deadline (Soonest first) - items with deadlines come before those without
            if (a.deadline && b.deadline) {
                return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
            }
            if (a.deadline) return -1;
            if (b.deadline) return 1;

            // 3. Created Date (Newest first)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    };

    // Apply filter then sort
    const processedTasks = smartSort(tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    }));

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate('AddTask', { task: item })}
            >
                <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, item.status === 'completed' && styles.completedText]}>{item.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
                        <Text style={styles.priorityText}>{item.priority}</Text>
                    </View>
                </View>

                {item.category && (
                    <View style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>{item.category}</Text>
                    </View>
                )}

                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.cardDate}>Due: {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'No Deadline'}</Text>
            </TouchableOpacity>

            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => handleStatusToggle(item)} style={styles.actionButton}>
                    <Text style={{ color: item.status === 'completed' ? theme.colors.textSecondary : theme.colors.success }}>
                        {item.status === 'completed' ? 'Undo' : 'Complete'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.actionButton}>
                    <Text style={{ color: theme.colors.error }}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Hi, {user?.name || 'User'}</Text>
                <TouchableOpacity onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                {['all', 'pending', 'completed'].map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterChip, filter === f && styles.activeFilter]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>{f.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
                <FlatList
                    data={processedTasks}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No tasks found. Add one!</Text>}
                />
            )}

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddTask')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.m,
        paddingTop: theme.spacing.xl, // Safe area roughly
        backgroundColor: theme.colors.surface,
        elevation: 4,
    },
    welcomeText: {
        ...theme.typography.h2,
    },
    logoutText: {
        color: theme.colors.error,
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: theme.spacing.m,
    },
    filterChip: {
        paddingVertical: theme.spacing.s,
        paddingHorizontal: theme.spacing.m,
        borderRadius: theme.borderRadius.l,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: theme.spacing.s,
    },
    activeFilter: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    activeFilterText: {
        color: 'white',
        fontWeight: 'bold',
    },
    listContent: {
        padding: theme.spacing.m,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardContent: {
        marginBottom: theme.spacing.s,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.s,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text,
        flex: 1,
    },
    completedText: {
        textDecorationLine: 'line-through',
        color: theme.colors.textSecondary,
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 10,
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    categoryTag: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    categoryTagText: {
        fontSize: 10,
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
    },
    cardDesc: {
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.s,
    },
    cardDate: {
        fontSize: 12,
        color: theme.colors.secondary,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.s,
    },
    actionButton: {
        marginLeft: theme.spacing.m,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 20,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 32,
        color: 'white',
        marginTop: -4,
    },
});

export default HomeScreen;
