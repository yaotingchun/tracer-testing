import React, { useState, useEffect } from 'react';

export default function ProfilePage({ userId }) {
    const [profile, setProfile] = useState(null);

    const authenticatedFetch = (url, options = {}) => {
        let token = localStorage.getItem('token');
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };

        return fetch(url, options).then(res => {
            if (res.status === 401) {
                const refreshToken = localStorage.getItem('refreshToken');
                return fetch('/api/auth/refresh', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                })
                .then(r => r.json())
                .then(data => {
                    localStorage.setItem('token', data.token);
                    options.headers['Authorization'] = `Bearer ${data.token}`;
                    return fetch(url, options); // Retry
                });
            }
            return res;
        });
    };

    useEffect(() => {
        authenticatedFetch(`/api/users/${userId}/profile`)
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
