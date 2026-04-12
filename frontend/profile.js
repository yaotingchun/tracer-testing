import React, { useState, useEffect } from 'react';

export default function ProfilePage({ userId }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch(`/api/users/${userId}/profile`)
            .then(res => res.json())
            .then(data => setProfile(data));
    }, [userId]);

    if (!profile) return <div>Loading profile...</div>;

    return (
        <div className="profile-container" style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>My Profile</h2>
            <p>Name: {profile.first_name} {profile.last_name}</p>
            <p>Delivery Address: {profile.address}</p>
        </div>
    );
}
