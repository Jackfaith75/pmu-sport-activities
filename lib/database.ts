import activities from '../data/activities.json';
import registrations from '../data/registrations.json';

export const getAllActivities = async () => {
  return activities;
};

export const getParticipantsByActivityId = async (activityId: string) => {
  return registrations.filter((r) => r.activityId === activityId);
};
