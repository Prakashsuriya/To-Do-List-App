
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { theme } from '../styles/theme';

const AddEditTaskScreen = ({ navigation, route }: any) => {
    const taskToEdit = route.params?.task;
    const isEdit = !!taskToEdit;

    const [title, setTitle] = useState(taskToEdit?.title || '');
    const [description, setDescription] = useState(taskToEdit?.description || '');
    const [priority, setPriority] = useState(taskToEdit?.priority || 'medium');
    const [category, setCategory] = useState(taskToEdit?.category || 'General');
    const [deadline, setDeadline] = useState(taskToEdit?.deadline ? new Date(taskToEdit.deadline).toISOString().split('T')[0] : '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title) {
            Alert.alert('Error', 'Title is required');
            return;
        }
        setLoading(true);
        try {
            const payload = {
                title,
                description,
                priority,
                category,
                deadline: deadline || undefined, // Simple string YYYY-MM-DD for now
            };

            if (isEdit) {
                await api.put(`/tasks/${taskToEdit._id}`, payload);
            } else {
                await api.post('/tasks', payload);
            }
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['General', 'Work', 'Personal', 'Shopping', 'Study'];

    const CategoryChip = ({ item }: any) => (
        <TouchableOpacity
            style={[
                styles.categoryChip,
                category === item && styles.categoryChipActive,
            ]}
            onPress={() => setCategory(item)}
        >
            <Text style={[styles.categoryText, category === item && { color: 'white' }]}>{item}</Text>
        </TouchableOpacity>
    );

    const PriorityButton = ({ level }: any) => (
        <TouchableOpacity
            style={[
                styles.priorityBtn,
                priority === level && styles.priorityBtnActive,
                { borderColor: level === 'high' ? theme.colors.error : level === 'medium' ? theme.colors.secondary : theme.colors.success }
            ]}
            onPress={() => setPriority(level)}
        >
            <Text style={[styles.priorityText, priority === level && { color: 'black' }]}>{level.toUpperCase()}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{isEdit ? 'Edit Task' : 'New Task'}</Text>

            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter task title"
                placeholderTextColor={theme.colors.textSecondary}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={4}
            />

            <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
            <TextInput
                style={styles.input}
                value={deadline}
                onChangeText={setDeadline}
                placeholder="2024-12-31"
                placeholderTextColor={theme.colors.textSecondary}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
                {categories.map(cat => (
                    <CategoryChip key={cat} item={cat} />
                ))}
            </View>

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
                <PriorityButton level="low" />
                <PriorityButton level="medium" />
                <PriorityButton level="high" />
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>{isEdit ? 'Update Task' : 'Create Task'}</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.m,
    },
    title: {
        ...theme.typography.h1,
        marginBottom: theme.spacing.l,
        marginTop: theme.spacing.m,
    },
    label: {
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.s,
        marginLeft: theme.spacing.xs,
    },
    input: {
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        borderRadius: theme.borderRadius.m,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.l,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: theme.spacing.l,
    },
    categoryChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: theme.colors.surface,
    },
    categoryChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    categoryText: {
        color: theme.colors.text,
        fontSize: 12,
        fontWeight: 'bold',
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xl,
    },
    priorityBtn: {
        flex: 1,
        borderWidth: 1,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        marginHorizontal: theme.spacing.xs,
    },
    priorityBtnActive: {
        backgroundColor: '#FFF',
    },
    priorityText: {
        color: theme.colors.text,
        fontWeight: 'bold',
        fontSize: 12,
    },
    submitBtn: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
        marginBottom: 40,
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default AddEditTaskScreen;
