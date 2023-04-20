import { randomKey } from "../../utility/encryption";
import { nodes } from "./Simulation";

export let totalConnections = 0;

// Define types of messages
const messageTypes = {
  VERIFY_NODE: "VERIFY_NODE",
};

export type NodeIndex = [number, number];
export interface NodeMemory {
  id: string,
  trust: number,
  index: NodeIndex,
}
interface NodeStorage {
  otherNodes: NodeMemory[][],
}

export class Node {
  id: string;
  connectedNodes: Node[] = [];
  index: NodeIndex = [0, 0];
  
  storage: NodeStorage = { otherNodes: [] };

  constructor() {
    this.id = randomKey(64);
  }

  connect(otherNode: Node, initiator = true) {
    this.connectedNodes.push(otherNode);

    if (initiator) {
      otherNode.connect(this, false);

      totalConnections++;
    }
  }

  sendMessage(type: string, index: NodeIndex, options: any) {
    let otherNode = this.connectedNodes.find((node) => node.index === index);

    if (!otherNode) {
      otherNode = this.findNode(index);
      this.connect(otherNode);
    }

    let payload: any;
    let callback: Function;

    switch (type) {
      case messageTypes.VERIFY_NODE: {
        payload = options.index;
        callback = (res: NodeMemory) => {
          console.log(res);
        }
      }
    }

    otherNode.recieveMessage(type, payload, callback);
  }

  recieveMessage(type: string, payload: any, callback: Function) {
    switch (type) {
      case messageTypes.VERIFY_NODE: {
        callback(this.findNodeMemory(payload));

        break;
      }

      default:
    }
  }

  private findNode(index: NodeIndex) {
    return nodes.find((node) => this.findNodeMemory(index).id === node.id);
  }

  private findNodeMemory = (index: NodeIndex) => {
    const [x, y] = index;
    const yNodes = this.storage.otherNodes[x] || [];
    return yNodes[y] || null;
  }

  cycle() {

  }
}
