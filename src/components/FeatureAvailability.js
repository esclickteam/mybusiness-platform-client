const checkFeatureAvailability = (feature, userPlan) => {
  const featuresByPlan = {
    VIP: ['Unlimited inquiries', 'Chat with clients', 'Appointment scheduling / Home services', 'Business-to-business collaboration'],
    Professional: ['Unlimited inquiries', 'Chat with clients', 'Appointment scheduling / Home services'],
    Advanced: ['Up to 50 inquiries', 'Chat with clients'],
    Free: ['Business page only'],
  };

  return featuresByPlan[userPlan].includes(feature);
};

export default checkFeatureAvailability;
