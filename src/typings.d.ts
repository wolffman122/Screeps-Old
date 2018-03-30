declare namespace NodeJS{
  interface Global {
    SCRIPT_VERSION: number
    lastTick: number
    LastMemory: Memory
    Memory: Memory
    roomData: {
      [key: string]: RoomData
    }
    keepAmount: Number
    spreadAmount: Number
    sellAbove: Number
  }
}

interface RawMemory{
  _parsed: Memory
}

interface SerializedProcess{
  name: string
  priority: number
  metaData: object
  suspend: string | number | boolean
  parent: string | undefined
}

interface RoomData{
  [name: string]: any
  constructionSites: ConstructionSite[]
  containers: StructureContainer[]
  extensions: StructureExtension[]
  extractor: StructureExtractor | undefined
  nuker: StructureNuker | undefined
  generalContainers: StructureContainer[]
  mineral: Mineral | undefined
  labs: StructureLab[]
  roads: StructureRoad[]
  spawns: StructureSpawn[]
  sources: Source[]
  sourceContainers: StructureContainer[]
  sourceContainerMaps: {[id: string]: StructureContainer}
  towers: StructureTower[]
  enemySpawns: StructureSpawn[]
  enemyExtensions: StructureExtension[]
  ramparts: StructureRampart[]
  walls: StructureWall[]
  links: StructureLink[]
  sourceLinks: StructureLink[]
  sourceLinkMaps: {[id: string]: StructureLink}
  storageLink: StructureLink | undefined
  controllerLink: StructureLink | undefined
  controllerContainer: StructureContainer | undefined
  mineralContainer: StructureContainer | undefined
}

interface IPCMessage{
  from: string
  to: string
  message: object
}

interface DeliveryTarget extends Structure{
  energy: number
  energyCapacity: number
  store: {
    [resource: string]: number
  }
  storeCapacity: number
}

interface CreepMetaData{
  creep: string
}

interface DeliverProcessMetaData extends CreepMetaData{
  target: string
  resource: string
}

interface EnergyManagementMetaData{
  roomName: string
  harvestCreeps: {
    [source: string]: string[]
  }
  distroCreeps: {
    [container: string]: string
  }
  upgradeCreeps: string[]
  spinCreeps: string[]
  upgradeDistroCreeps: string[]
}

interface MineralManagementMetaData
{
  roomName: string
  mineralHarvesters: string[]
  mineralHaulers: string[]
}

interface HoldRoomManagementProcessMetaData
{
  roomName: string
  holdCreeps: string[]
  harvestCreeps: {
    [source: string]: string[]
  }
  distroCreeps: {
    [container: string]: string
  }
  builderCreeps: string[]
  workerCreeps: string[]
  flagName: string

}

interface BunkerLayout{
  buildings: {
    [structureType: string]: {
      pos: [
        {
          x: number
          y: number
        }
      ]
    }
  }
}

interface Creep {
  fixMyRoad(): boolean;
}

interface Shortage {
  mineralType: string;
  amount: number;
}

interface LabProcess {
  targetShortage: Shortage;
  currentShortage: Shortage;
  reagentLoads: {[mineralType: string]: number};
  loadProgress: number;
}

interface LabDistroLifetimeProcessMetaData
{
  creep: string,
  roomName: string,
  reagentLabIds: string[],
  productLabIds: string[],
  labProcess: LabProcess,
  command: Command,
  lastCommandTick
  checkProcessTick: number,

}

interface LabManagementProcessMetaData
{
  roomName: string,
  labDistros: string[],
}

interface Command {
  origin: string;
  destination: string;
  resourceType: string;
  amount?: number;
  reduceLoad?: boolean;
}
