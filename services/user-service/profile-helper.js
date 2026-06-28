function getProfileData(id) {
    // George: Exposing customer tier
    return {
        customer_id: id,
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St, New York, NY 10001',
        phone_number: '555-0199',
        tier: 'gold' // Mock gold tier status
    };
}

module.exports = { getProfileData };
