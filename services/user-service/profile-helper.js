// Charlie: Separating profile database interaction from express listener logic
function getProfileData(id) {
    return {
        customer_id: id,
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St, New York, NY 10001',
        phone: '555-0199'
    };
}

module.exports = { getProfileData };
