'use client';

import { useEffect, useState, useCallback } from 'react';
import GroupItem from './GroupItem';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchGroups = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch('/api/groups', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch groups: ${response.statusText}`);
            }

            const data = await response.json();
            setGroups(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching groups:', err);
            setError(err.message || 'Failed to load groups. Please try again later.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    if (loading) {
        return <div>Loading groups...</div>; // You can replace this with a spinner for better UX
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="group-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.length === 0 ? (
                <p>No groups found.</p>
            ) : (
                groups.map((group) => <GroupItem key={group._id} group={group} />)
            )}
        </div>
    );
};

export default GroupList;
