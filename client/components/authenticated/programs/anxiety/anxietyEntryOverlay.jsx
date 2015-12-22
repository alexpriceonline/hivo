/**
 * An whole page overlay that contains a form for
 * adding/editing anxiety hierarchy entries.
 */
AnxietyEntryOverlay = React.createClass({
	propTypes: {
		/**
		 * The Mongo `_id` for the current user.
		 */
		userId: React.PropTypes.string.isRequired,
		/**
		 * An entry to modified. If `null` add new entry.
		 */
		entry: React.PropTypes.object,
		/**
		 * The Mongo `_id` for the current exercise.
		 */
		exerciseId: React.PropTypes.string.isRequired,
		/**
		 * An object containing the `hard`, `medium` and `easy`
		 * arrays of entry objects.
		 */
		entries: React.PropTypes.object.isRequired,
		/**
		 * An event handler for a delete `onClick` event.
		 */
		handleDelete: React.PropTypes.func.isRequired,
		/**
		 * An event handler for a cancel `onClick` event.
		 */
		handleCancel: React.PropTypes.func.isRequired
	},
	/**
	 * The state of the overlay contains the values of
	 * the child form elements.
	 */
	getInitialState() {
		return {
			entryText: '',
			entryTextError: {
				status: false,
				message: ''
			},
			entryPercentage: '50'
		};
	},
	/**
	 * If the component was mounted with an entry prop,
	 * set the state for edit mode.
	 */
	componentDidMount() {
		if (this.props.entry) {
			this.setState({
				entryText: this.props.entry.text,
				entryPercentage: this.props.entry.percentage.toString()
			});
		}

		$('#entryText').focus();
	},
	/**
	 * Creates a new anxiety hierarchy entry using the
	 * data stored in the state.
	 * @param {Object} event
	 */
	handleSubmit(event) {
		event.preventDefault();

		if (!this.state.entryText.length) {
			this.setState({
				entryTextError: {
					status: true,
					message: 'You didn\'t enter any text!'
				},
			});
		} else {
			// Existing entries
			let entries = this.props.entries;

			let text = FormattingHelpers.sentanceCase(
				this.state.entryText
			);

			let newEntry = {
				text: text,
				percentage: parseInt(this.state.entryPercentage)
			};

			// If in 'edit mode'
			if (this.props.entry) {
				let diff = this.props.entry.difficulty;

				entries[diff][this.props.entry.id] = newEntry;
				entries[diff] = _.sortByOrder(
					entries[diff],
					['percentage', 'text'],
					['desc', 'asc']
				);
			} else { // 'new entry mode'
				let defaultPosition = 'hard';

				if (newEntry.percentage < 30) {
					defaultPosition = 'easy';
				} else if (newEntry.percentage >= 30 && newEntry.percentage < 60) {
					defaultPosition = 'medium';
				}

				entries[defaultPosition].push(newEntry);

				entries[defaultPosition] = _.sortByOrder(
					entries[defaultPosition],
					['percentage', 'text'],
					['desc', 'asc']
				);
			}

			let props = {
				userId: this.props.userId,
				exerciseData: {
					entries: entries
				}
			};

			Meteor.call(
				'updateExercise',
				this.props.exerciseId,
				props
			);

			// Hide overlay
			this.props.handleCancel();
		}
	},
	/**
	 * Updates the state with the latest entryText.
	 * @param {Object} event
	 */
	handleEntryTextChange(event) {
		this.setState({
			entryText: event.target.value,
			entryTextError: {
				status: false,
				message: ''
			}
		});
	},
	/**
	 * Updates the state with the latest entryPercentage value.
	 * @param {Object} event
	 */
	handleEntryPercentageChange(event) {
		this.setState({
			entryPercentage: event.target.value
		});
	},
	/**
	 * Turns a numeric percentage value into a helpful word.
	 * @param {String} percentage
	 * @return {String} text
	 */
	getPercentageText(percentage) {
    if (percentage < 30) {
			return 'Okay';
		} else if (percentage >= 30 && percentage < 60) {
			return 'Anxious';
		} else if (percentage >= 60 && percentage < 80) {
			return 'Really anxious';
		} else if (percentage >= 80) {
			return 'I\'m going to die';
		}
  },
	/**
	 * Delete event handler
	 * @param {Object} event
	 */
	handleDelete(event) {
		event.preventDefault();

		this.props.handleDelete(
			this.props.entry.difficulty,
			this.props.entry.id
		);

		// Hide overlay
		this.props.handleCancel();
	},
	deleteButton() {
		if (this.props.entry) {
			return (
				<a
					className="button mod-delete"
					href="#delete"
					onClick={this.handleDelete}>
						Delete
				</a>
			);
		}
	},
	handleKeyUp(event) {
		// If key up is (esc) trigger close
		if (event.which == 27) {
			this.props.handleCancel();
		}
	},
	render() {
		let helpTextClass = (
			this.state.entryTextError.status ?
			'help-text mod-error' :
			'help-text'
		);

		return (
			<div className="overlay">
				<div className="container mod-small">
					<form onSubmit={this.handleSubmit}>

						<div className="form-group">
							<label
								className="label"
								htmlFor="entryText">
									What makes you anxious?
							</label>

							<TextBox
								id={'entryText'}
								placeholder={'Write in here...'}
								text={this.state.entryText}
								onKeyUp={this.handleKeyUp}
								onChange={this.handleEntryTextChange} />

							<span className={helpTextClass}>
								{this.state.entryTextError.message}
							</span>
						</div>

						<div className="form-group">
							<label
								className="label"
								htmlFor="entryPercentage">
									What rating would you give that?
							</label>

							<PercentageSlider
								id={'entryPercentage'}
								value={this.state.entryPercentage}
								valueText={this.getPercentageText(this.state.entryPercentage)}
								onKeyUp={this.handleKeyUp}
								onChange={this.handleEntryPercentageChange} />
						</div>

						<SubmitButton modClass={'mod-right'} />
						<CancelButton
							modClass={'mod-right mod-margin'}
							onClick={this.props.handleCancel} />
						{this.deleteButton()}

					</form>
				</div>
			</div>
		);
	}
});
