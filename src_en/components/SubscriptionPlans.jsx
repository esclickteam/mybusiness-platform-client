import React from 'react';

const SubscriptionPlans = ({ userPlan }) => {
    const plans = [
        {
            name: 'VIP',
            price: 219,
            features: ['Unlimited inquiries', 'Chat with customers', 'Appointment scheduling/Home services', 'Business collaboration'],
        },
        {
            name: 'Professional',
            price: 189,
            features: ['Unlimited inquiries', 'Chat with customers', 'Appointment scheduling/Home services'],
        },
        {
            name: 'Advanced',
            price: 89,
            features: ['Up to 50 inquiries', 'Chat with customers'],
        },
        {
            name: 'Free',
            price: 0,
            features: ['Business page only'],
        },
    ];

    const currentPlan = plans.find(plan => plan.name === userPlan);

    return (
        <div className="subscription-plans">
            {plans.map(plan => (
                <div key={plan.name} className={`plan ${plan.name === currentPlan.name ? 'selected' : ''}`}>
                    <h3>{plan.name}</h3>
                    <p>{plan.price} ₪ / month</p>
                    <ul>
                        {plan.features.map(feature => (
                            <li key={feature}>{feature}</li>
                        ))}
                    </ul>
                    {plan.name === currentPlan.name ? (
                        <button disabled>Select Package</button>
                    ) : (
                        <button>Select Package</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default SubscriptionPlans;