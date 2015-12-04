const authenticatedRedirect = () => {
  if (!Meteor.loggingIn() && !Meteor.userId()) {
    FlowRouter.go('login');
  }
};

const authenticatedRoutes = FlowRouter.group({
  name: 'authenticated',
  triggersEnter: [authenticatedRedirect]
});

// Admin routes

authenticatedRoutes.route('/', {
  name: 'index',
  action() {
		ReactLayout.render( Default, { yield: <Index /> } );
  }
});

authenticatedRoutes.route('/patient/new', {
  name: 'adminAddPatient',
  action() {
		ReactLayout.render( Default, { yield: <AddPatient /> } );
  }
});

authenticatedRoutes.route('/patient/:_id', {
  name: 'adminPatientOverview',
  action() {
		ReactLayout.render( Default, { yield: <PatientOverview /> } );
  }
});

// Patient routes

authenticatedRoutes.route('/depression', {
  name: 'depression',
  action() {
		ReactLayout.render(Default, {
			yield: <DepressionIndex />
			// footer: <Footer />
		});
  }
});

authenticatedRoutes.route('/depression/impact-of-depression', {
  name: 'impact-of-depression',
  action() {
		ReactLayout.render(Default, {
			yield: <ImpactOfDepression />,
			footer: <Footer />
		});
  }
});

authenticatedRoutes.route('/depression/thinking-ahead', {
  name: 'thinking-ahead',
  action() {
		ReactLayout.render(Default, {
			yield: <ThinkingAhead />,
			footer: <Footer />
		});
  }
});

authenticatedRoutes.route('/depression/starting-point', {
  name: 'starting-point',
  action() {
		ReactLayout.render(Default, {
			yield: <StartingPoint />,
			footer: <Footer />
		});
  }
});

authenticatedRoutes.route('/depression/starting-point/:day/:month/:year', {
  name: 'starting-point',
	triggersEnter: [Modules.both.checkValidDate],
  action() {
		ReactLayout.render(Default, {
			yield: <StartingPoint />,
			footer: <Footer />
		});
  }
});

authenticatedRoutes.route('/depression/starting-point/:day/:month/:year/new/:time', {
  name: 'starting-point-new',
	triggersEnter: [
		Modules.both.checkValidDate,
		Modules.both.checkValidTime
	],
  action() {
		ReactLayout.render(Default, {
			yield: <StartingPointNew />,
			footer: <Footer />
		});
  }
});

authenticatedRoutes.route('/depression/starting-point/:day/:month/:year/edit/:time/:entryId', {
  name: 'starting-point-edit',
	triggersEnter: [
		Modules.both.checkValidDate,
		Modules.both.checkValidTime
	],
  action() {
		ReactLayout.render(Default, {
			yield: <StartingPointEdit />,
			footer: <Footer />
		});
  }
});
