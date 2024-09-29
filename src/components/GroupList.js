import { useState, useEffect } from 'react';
import GroupItem from './GroupItem'; // Assuming GroupItem is in the same directory

const GroupList = () => {
    const [groups, setGroups] = useState([]); // State to hold groups
    const [loading, setLoading] = useState(true);

    // Fetch all groups and their todos
    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/groups`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch groups');
            }

            const data = await response.json();
            setGroups(data); // Set groups and their todos
            setLoading(false);
        } catch (err) {
            console.error('Error fetching groups:', err.message);
            setLoading(false);
        }
    };

    // Fetch groups when the component mounts
    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading groups...</p>
            ) : (
                <div>
                    {groups.map((group) => (
                        <GroupItem key={group._id} group={group} /> // Pass each group to GroupItem
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupList;
