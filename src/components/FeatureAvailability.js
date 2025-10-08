const checkFeatureAvailability = (feature, userPlan) => {
    const featuresByPlan = {
        VIP: ['פניות ללא הגבלה', 'צ\'אט עם לקוחות', 'תיאום תורים/שירותי בית', 'שיתוף פעולה בין עסקים'],
        מקצועית: ['פניות ללא הגבלה', 'צ\'אט עם לקוחות', 'תיאום תורים/שירותי בית'],
        מתקדמת: ['עד 50 פניות', 'צ\'אט עם לקוחות'],
        חינמית: ['עמוד עסקי בלבד'],
    };

    return featuresByPlan[userPlan].includes(feature);
}

export default checkFeatureAvailability;
