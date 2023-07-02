import * as ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('ws://api.rifamax.app/cable');
export default cable;
