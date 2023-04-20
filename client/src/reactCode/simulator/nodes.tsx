import { randomKey } from "../../utility/encryption";
import { verifyDataArray } from "./helpers";
import { nodes } from "./Simulation";

export let totalConnections = 0;

// Define types of messages
const messageTypes = {
  VERIFY_NODE: "VERIFY_NODE",
  FIND_INDEX: "FIND_INDEX",
};

// Define types for node information
export type NodeIndex = [number, number];
export interface NodeMemory {
  id: string,
  trust: number,
  index: NodeIndex,
}
interface NodeStorage {
  otherNodes: {
    [x: number]: {
      [y: number]: NodeMemory,
    }
  },
}

// The Node class represents a single peer in the network
export class Node {
  // Node info
  id: string;
  connectedNodes: Node[] = [];
  index: NodeIndex = null;

  // Node's local database
  storage: NodeStorage = { otherNodes: {} };

  constructor() {
    // Generate a random ID for unique, unindexed identification
    this.id = randomKey(64);
  }

  // Creates a connection between two nodes
  connect(otherNode: Node, initiator = true) {
    // Connect to specified node by adding it to the connection list
    this.connectedNodes.push(otherNode);

    // If this node initiated the connection, the other node needs to know there's a connection
    if (initiator) {
      otherNode.connect(this, false);

      // Increase debug statistic
      totalConnections++;

      // Check if this node doesn't have a defined coordinates within the 2D network grid
      if (!this.index) {
        let foundIndex: NodeIndex = null;

        // Request an unoccupied coordinate from connected peers
        for (let i = 0; i < this.connectedNodes.length && !foundIndex; i++) {
          // Each peer is sent a request for an empty index until one is recieved
          this.sendMessage(
            messageTypes.FIND_INDEX,
            this.connectedNodes[i].index,
            null,
            (res: NodeIndex) => foundIndex = res,
          );
        }

        // If an empty space was found, verify that there is no one else occupying it
        if (foundIndex) {
          // Make an array where all found peers occupying the space will be put
          const verifiedIds: string[] = [];
          // Broadcast a request to find out what exists in the coordinate
          this.broadcast(
            messageTypes.VERIFY_NODE,
            foundIndex,
            (res: NodeMemory) => {
              if (res) {
                verifiedIds.push(res.id);
              } else {
                verifiedIds.push(null);
              }
            },
          );

          // Verify which response was sent the most
          const verifiedData = verifyDataArray(verifiedIds);
          if (!verifiedData) {
            console.log("There was a democratic error in the verification process.");
          } else {
            const spaceTaken = verifiedData.data ? true : false;
            
            // If the space was taken log a debug message
            if (spaceTaken) {
              console.log(`The space, ${JSON.stringify(foundIndex)} is in use.`);
            } else {
              // Otherwise, assign the found index to the node
              this.index = foundIndex;
            }
          }
        } else {
          // If there are no empty spaces around any of the connected nodes, log a debug message
          console.log("There are no empty spaces around any connected nodes.");
        }
      }
    }
  }

  sendMessage(type: string, index: NodeIndex, payload: any, callback: Function) {
    let otherNode = this.connectedNodes.find((node) => node.index === index);

    if (!otherNode) {
      otherNode = this.findNode(index);
      this.connect(otherNode);
    }

    otherNode.recieveMessage(type, payload, callback);
  }

  recieveMessage(type: string, payload: any, callback: Function) {
    switch (type) {
      case messageTypes.VERIFY_NODE: {
        callback(this.findNodeMemoryByIndex(payload));

        break;
      }

      case messageTypes.FIND_INDEX: {
        let foundIndex: NodeIndex = null;

        for (let x = this.index[0] - 5; x < this.index[0] + 5 && !foundIndex; x++) {
          const yNodes = this.storage.otherNodes[x];
          for (let y = this.index[1] - 5; y < this.index[1] + 5 && !foundIndex; y++) {
            if (!yNodes || !yNodes[y]) {
              foundIndex = [x, y];
            }
          }
        }

        callback(foundIndex);
        
        break;
      }

      default:
    }
  }

  broadcast(type: string, payload: any, callback: Function) {
    this.connectedNodes.forEach((node) => node.recieveMessage(type, payload, callback));
  }

  private findNode(index: NodeIndex) {
    return nodes.find((node) => this.findNodeMemoryByIndex(index).id === node.id);
  }

  private findNodeMemoryByIndex = (index: NodeIndex) => {
    const [x, y] = index;
    const yNodes = this.storage.otherNodes[x] || [];
    return yNodes[y] || null;
  }

  // private findNodeMemoryById = (id: string) => {
  //   return this.storage.otherNodes.find((node) => node.id === id);
  // }

  cycle() {
    
  }
}
