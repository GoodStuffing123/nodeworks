import { connect } from "./index";
import destroy from "./destroy";
import { username } from "../data/user";

const reload = () => {
  destroy();
  connect(username);
};

export default reload;
