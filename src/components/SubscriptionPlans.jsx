import React from 'react';

const SubscriptionPlans = ({ userPlan }) => {
    const plans = [
        {
            name: 'VIP',
            price: 219,
            features: ['Unlimited inquiries', 'Chat with clients', 'Appointment scheduling / Home services', 'Business collaborations'],
        },
        {
            name: 'Professional',
            price: 189,
            features: ['Unlimited inquiries', 'Chat with clients', 'Appointment scheduling / Home services'],
        },
        {
            name: 'Advanced',
            price: 89,
            features: ['Up to 50 inquiries', 'Chat with clients'],
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
                    <p>{plan.price} NIS / month</p>
                    <ul>
                        {plan.features.map(feature => (
                            <li key={feature}>{feature}</li>
                        ))}
                    </ul>
                    {plan.name === currentPlan.name ? (
                        <button disabled>Select Plan</button>
                    ) : (
                        <button>Select Plan</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default SubscriptionPlans;
