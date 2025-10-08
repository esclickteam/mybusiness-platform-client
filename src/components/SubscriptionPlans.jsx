import React from 'react';

const SubscriptionPlans = ({ userPlan }) => {
    const plans = [
        {
            name: 'VIP',
            price: 219,
            features: ['פניות ללא הגבלה', 'צ\'אט עם לקוחות', 'תיאום תורים/שירותי בית', 'שיתוף פעולה בין עסקים'],
        },
        {
            name: 'מקצועית',
            price: 189,
            features: ['פניות ללא הגבלה', 'צ\'אט עם לקוחות', 'תיאום תורים/שירותי בית'],
        },
        {
            name: 'מתקדמת',
            price: 89,
            features: ['עד 50 פניות', 'צ\'אט עם לקוחות'],
        },
        {
            name: 'חינמית',
            price: 0,
            features: ['עמוד עסקי בלבד'],
        },
    ];

    const currentPlan = plans.find(plan => plan.name === userPlan);

    return (
        <div className="subscription-plans">
            {plans.map(plan => (
                <div key={plan.name} className={`plan ${plan.name === currentPlan.name ? 'selected' : ''}`}>
                    <h3>{plan.name}</h3>
                    <p>{plan.price} ש"ח / חודש</p>
                    <ul>
                        {plan.features.map(feature => (
                            <li key={feature}>{feature}</li>
                        ))}
                    </ul>
                    {plan.name === currentPlan.name ? (
                        <button disabled>בחר חבילה</button>
                    ) : (
                        <button>בחר חבילה</button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default SubscriptionPlans;
