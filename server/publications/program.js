Meteor.publish('program', (userId, route) => {
  check(userId, String);
  check(route, String);

  return Programs.find({
    userId: userId,
    route: route
  });
});