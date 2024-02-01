import * as ActionCable from "actioncable";

const cable = ActionCable.createConsumer("wss://api.rifa-max.com/cable");
export default cable;
