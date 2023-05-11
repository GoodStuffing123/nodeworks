import { randomKey } from "../../utility/encryption";
import {
  compressDataArray,
  gridPointFromNumber,
  iterateRandomRange,
  matchIndexes,
  VerifiedData,
  verifyDataArray,
} from "./helpers";
import { nodes } from "./Simulation";

export let totalConnections = 0;

// Define types of messages
const messageTypes = {
  FIND_NODE: "FIND_NODE",
  DOWNLOAD_NODES: "DOWNLOAD_NODES",

  GET_FREE_INDEX: "GET_FREE_INDEX",
  VERIFY_INDEX: "VERIFY_INDEX",
};

// Define types for node information
export type NodeIndex = [number, number];
export interface NodeMemory {
  id: string;
  trust: number;
  index: NodeIndex;
}

interface NodeStorage {
  otherNodes: {
    [x: number]: {
      [y: number]: NodeMemory;
    };
  };
}

const maxNodeDistance = 4;
const maxScanDistance = 3;

const maxConnections = 8;
const prefferedConnections = 5;

// The Node class represents a single peer in the network
export class Node {
  // Node info
  id: string;
  connectedNodes: Node[] = [];
  index: NodeIndex = null;

  // Node's local database
  storage: NodeStorage = { otherNodes: {} };

  // Is cycle running for this node
  cycling = false;

  constructor() {
    // Generate a random ID for unique, unindexed identification
    this.id = randomKey(64);
  }

  // Creates a connection between two nodes
  connect(otherNode: Node, initiator = true) {
    if (
      this.connectedNodes.length < maxConnections ||
      matchIndexes(this.index, [0, 0])
    ) {
      // Connect to specified node by adding it to the connection list
      this.connectedNodes.push(otherNode);

      // If this node initiated the connection, the other node needs to know there's a connection
      if (initiator) {
        otherNode.connect(this, false);

        // Increase debug statistic
        totalConnections++;

        // Check if this node doesn't have a defined coordinates within the 2D network grid
        if (!this.index) {
          const attemptAssignIndex = (failedIndexes: NodeIndex[] = []) => {
            let foundIndex: NodeIndex = null;

            // Request an unoccupied coordinate from connected peers
            for (
              let i = 0;
              i < this.connectedNodes.length && !foundIndex;
              i++
            ) {
              // Each connected peer is sent a request for an empty index until one is recieved
              this.sendMessage(
                messageTypes.GET_FREE_INDEX,
                this.connectedNodes[i].index,
                failedIndexes,
                (res: NodeIndex) => (foundIndex = res),
              );
            }

            // If an empty space was found, verify that there is no one else occupying it
            if (foundIndex) {
              let verifiedData = this.verifiedBroadcast(
                messageTypes.VERIFY_INDEX,
                {
                  id: this.id,
                  trust: 0,
                  index: foundIndex,
                },
              );

              if (!verifiedData) {
                console.log(
                  "There was a democratic error in the verification process.",
                );
              } else {
                const spaceTaken = verifiedData.data ? true : false;

                // If the space was taken log a debug message
                if (spaceTaken) {
                  console.log(`Index ${foundIndex} was already taken.`);

                  attemptAssignIndex([...failedIndexes, foundIndex]);
                } else {
                  // Otherwise, assign the found index to the node
                  this.index = foundIndex;

                  // Download any required data in local area
                  const downloads: NodeMemory[][] = this.verifiedBroadcast(
                    messageTypes.DOWNLOAD_NODES,
                    [
                      // x1
                      this.index[0] - maxNodeDistance,
                      // x1
                      this.index[0] + maxNodeDistance,

                      // y2
                      this.index[1] - maxNodeDistance,
                      // y2
                      this.index[1] + maxNodeDistance,
                    ],
                    [this.index],
                    true,
                  );

                  const pos: NodeIndex = [
                    this.index[0] - maxNodeDistance,
                    this.index[1] - maxNodeDistance,
                  ];

                  const verifiedNodes: VerifiedData[] = [];

                  let iterations = 0;
                  downloads.forEach((download, i) => {
                    download.forEach((nodeMemory) => {
                      if (!matchIndexes(nodeMemory.index, this.index)) {
                        const verifiedIndex = verifiedNodes.findIndex(
                          (verifiedNode) =>
                            matchIndexes(
                              verifiedNode.data.index,
                              nodeMemory.index,
                            ),
                        );

                        if (verifiedIndex === -1) {
                          verifiedNodes.push({
                            data: nodeMemory,
                            recurrence: 1,
                            index: i,
                          });
                        } else if (i !== verifiedNodes[verifiedIndex].index) {
                          verifiedNodes[verifiedIndex].recurrence++;
                        }
                      }
                    });
                  });

                  verifiedNodes.forEach((verifiedNode) => {
                    if (downloads.length === 1 || verifiedNode.recurrence > 1) {
                      this.setStoredNode(verifiedNode.data);
                    }
                  });
                }
              }
            } else {
              // If there are no empty spaces around any of the connected nodes, log a debug message
            }
          };

          attemptAssignIndex();
        }
      }

      if (this.index && otherNode.index) {
        this.setStoredNode(
          {
            id: otherNode.id,
            trust: 0,
            index: otherNode.index,
          },
          otherNode.index,
        );
      }
    } else {
      if (!initiator) {
        otherNode.disconnect(this, false);

        totalConnections--;
      }
    }
  }

  // Disconnect from a connected node
  disconnect(node: Node, initiator = true) {
    if (initiator) {
      totalConnections--;
      node.disconnect(this, false);
    }

    this.connectedNodes.splice(this.connectedNodes.indexOf(node), 1);
  }

  // Terminates all connections
  terminate() {
    for (let i = this.connectedNodes.length - 1; i > -1; i--) {
      this.disconnect(this.connectedNodes[i]);
    }
  }

  // Sends a message to another node
  sendMessage(
    type: string,
    index: NodeIndex,
    payload: any,
    callback: Function,
  ) {
    // Find the node from your list of currently connected nodes
    let otherNode = this.connectedNodes.find((node) => node.index === index);

    // If this node is not connected to the node they are sending the message to
    if (!otherNode) {
      // Find it in the local database
      otherNode = this.findNode(index);
      // And connect to it
      this.connect(otherNode);
    }

    // Have the other node recieve the message
    otherNode.recieveMessage(type, payload, callback);
  }

  // Recieve a message from another node
  recieveMessage(type: string, payload: any, callback: Function) {
    // Check what type of message it is and respond accordingly
    switch (type) {
      // Return a node stored in the local database
      case messageTypes.FIND_NODE: {
        callback(this.findNodeMemoryByIndex(payload));

        break;
      }

      // Return a specified area of nodes
      case messageTypes.DOWNLOAD_NODES: {
        const nodeMemories: NodeMemory[] = [];

        for (let x = payload[0]; x <= payload[1]; x++) {
          for (let y = payload[2]; y <= payload[3]; y++) {
            const foundMemory = this.findNodeMemoryByIndex([x, y]);
            if (foundMemory && foundMemory.index) {
              nodeMemories.push(foundMemory);
            }
          }
        }

        callback(nodeMemories);

        break;
      }

      // Find an unoccupied coordinate around this node and return it
      case messageTypes.GET_FREE_INDEX: {
        let foundIndex: NodeIndex = null;

        // Iterate through grid area around this node
        iterateRandomRange(
          0,
          Math.pow(maxScanDistance * 2 + 1, 2),
          (xy, cancel) => {
            if (foundIndex) {
              cancel();
              return;
            }

            const [x, y] = gridPointFromNumber(xy, maxScanDistance * 2 + 1);
            const indexCandidate: NodeIndex = [
              x - maxScanDistance + this.index[0],
              y - maxScanDistance + this.index[1],
            ];

            const yNodes = this.storage.otherNodes[indexCandidate[0]];
            if (foundIndex) {
              cancel();
              return;
            }

            if (
              // The current index is not this node's index
              !matchIndexes(this.index, indexCandidate) &&
              // This coordinate is an unoccupied space
              (!yNodes || !yNodes[indexCandidate[1]]) &&
              // It is not part of the excluded index list passed through the payload
              !payload.includes(indexCandidate)
            ) {
              // Make this coordinate the found index
              foundIndex = indexCandidate;
            }
          },
        );

        if (!foundIndex) {
          let nextNode: NodeMemory = null;
          for (let d = maxScanDistance; d > 0; d--) {
            const cellSize = d * 2 + 1;
            iterateRandomRange(0, d * 8, (i, cancel) => {
              const x =
                (i < cellSize
                  ? i
                  : i < cellSize * 2
                  ? cellSize
                  : i < cellSize * 3
                  ? cellSize * 3 - i
                  : 0) -
                d +
                this.index[0];

              const y =
                (i < cellSize
                  ? 0
                  : i < cellSize * 2
                  ? i
                  : i < cellSize * 3
                  ? cellSize
                  : cellSize * 3 - i) -
                d +
                this.index[1];

              const nodeToMessage = this.findNodeMemoryByIndex([x, y]);
              if (
                nodeToMessage?.index &&
                !payload.find((excludedIndex: NodeIndex) =>
                  matchIndexes(nodeToMessage.index, excludedIndex),
                )
              ) {
                this.sendMessage(
                  messageTypes.GET_FREE_INDEX,
                  nodeToMessage.index,
                  [...payload, this.index],
                  (res: NodeIndex) => {
                    callback(res);
                  },
                );

                cancel();
              }
            });
          }
        } else {
          callback(foundIndex);
        }

        break;
      }

      // Verify if a spot is free
      case messageTypes.VERIFY_INDEX: {
        const verifiedData = this.verifiedBroadcast(
          messageTypes.FIND_NODE,
          payload.index,
          [this.index],
        );

        if (!verifiedData || !verifiedData.data) {
          this.setStoredNode(payload);
        } else {
          this.setStoredNode(verifiedData.data);
        }

        console.log(verifiedData);

        callback(verifiedData?.data);

        break;
      }

      default:
    }
  }

  // Send a message to all connected nodes
  broadcast(
    type: string,
    payload: any,
    callback: Function,
    exclude: NodeIndex[] = [this.index],
  ) {
    this.connectedNodes.forEach((node) => {
      if (
        node.index &&
        !exclude.find((exIndex) => matchIndexes(node.index, exIndex))
      ) {
        node.recieveMessage(type, payload, callback);
      }
    });
  }

  // Broadcast a message, verify the responses, and only return the verified response
  verifiedBroadcast(
    type: string,
    payload: any,
    exclude: NodeIndex[] = [this.index],
    nested: boolean = false,
  ): any {
    // Make an array where all returned will be put
    const verifiedDatas: any[] = [];

    // Broadcast the request
    this.broadcast(
      type,
      payload,
      (res: any) => {
        verifiedDatas.push(res);
      },
      exclude,
    );

    if (nested) {
      return verifiedDatas;
    } else {
      // Return the verified response
      return verifyDataArray(verifiedDatas);
    }
  }

  // Directly get a node based on its index
  private findNode(index: NodeIndex) {
    return nodes.find(
      (node) => this.findNodeMemoryByIndex(index).id === node.id,
    );
  }

  // Find a node memory based on its index
  private findNodeMemoryByIndex = (index: NodeIndex) => {
    const [x, y] = index;
    const yNodes = this.storage.otherNodes[x] || [];
    return yNodes[y] || null;
  };

  private setStoredNode(
    nodeMemory: NodeMemory,
    index: NodeIndex = nodeMemory.index,
  ) {
    const yNodes = this.storage.otherNodes[index[0]] || {};

    if (nodeMemory) {
      yNodes[index[1]] = nodeMemory;
    } else if (yNodes[index[1]]) {
      delete yNodes[index[1]];
    }

    if (Object.keys(yNodes).length) {
      this.storage.otherNodes[index[0]] = yNodes;
    } else if (this.storage.otherNodes[index[0]]) {
      delete this.storage.otherNodes[index[0]];
    }
  }

  // Run a single processing cycle to make new connections and balance the network
  cycle() {
    if (this.index) {
      if (!matchIndexes(this.index, [0, 0])) {
        const distantNodes: Node[] = this.connectedNodes.filter(
          (node) =>
            Math.abs(this.index[0] - node.index[0]) > maxScanDistance ||
            Math.abs(this.index[1] - node.index[1]) > maxScanDistance,
        );

        if (
          distantNodes.length &&
          distantNodes.length < this.connectedNodes.length
        ) {
          distantNodes.forEach((node) => {
            this.disconnect(node, true);
          });
        }

        if (this.connectedNodes.length > maxConnections) {
          this.connectedNodes.sort(
            (a, b) =>
              Math.hypot(
                a.index[0] - this.index[0],
                a.index[1] - this.index[1],
              ) -
              Math.hypot(
                b.index[0] - this.index[0],
                b.index[1] - this.index[1],
              ),
          );

          for (
            let i = this.connectedNodes.length - 1;
            i > maxConnections;
            i--
          ) {
            this.disconnect(this.connectedNodes[i], true);
          }
        } else if (this.connectedNodes.length < prefferedConnections) {
          for (
            let scanDist = 1;
            scanDist <= maxScanDistance &&
            this.connectedNodes.length < prefferedConnections;
            scanDist++
          ) {
            for (let x = -scanDist; x < scanDist; x++) {
              for (let y = -scanDist; y < scanDist; y++) {
                const coords: NodeIndex = [
                  x + this.index[0],
                  y + this.index[1],
                ];
                if (!matchIndexes(coords, [0, 0])) {
                  const nodeToConnect = this.findNodeMemoryByIndex(coords);
                  if (
                    nodeToConnect &&
                    nodeToConnect.index &&
                    !this.connectedNodes.find((node) =>
                      matchIndexes(nodeToConnect.index, node.index),
                    )
                  ) {
                    this.connect(
                      nodes.find((node) => node.id === nodeToConnect.id),
                      true,
                    );
                  }
                }
              }
            }
          }
        }
      } else if (this.connectedNodes.length) {
        this.terminate();
      }
    }
  }
}
