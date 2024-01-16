import * as ActionCable from 'actioncable';

const cable = ActionCable.createConsumer('wss://mock.rifa-max.com/cable');
export default cable;
