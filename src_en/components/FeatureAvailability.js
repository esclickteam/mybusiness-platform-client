```javascript
const checkFeatureAvailability = (feature, userPlan) => {
    const featuresByPlan = {
        VIP: ['Unlimited inquiries', 'Chat with customers', 'Appointment coordination/Home services', 'Business collaboration'],
        Professional: ['Unlimited inquiries', 'Chat with customers', 'Appointment coordination/Home services'],
        Advanced: ['Up to 50 inquiries', 'Chat with customers'],
        Free: ['Business page only'],
    };

    return featuresByPlan[userPlan].includes(feature);
}

export default checkFeatureAvailability;
```