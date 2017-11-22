declare namespace NodeJS{
  interface Global {
    SCRIPT_VERSION: number
    lastTick: number
    LastMemory: Memory
    Memory: Memory
    roomData: {
      [key: string]: RoomData
    }
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
  sourceLinks: StructureLink[]
  sourceLinkMaps: {[id: string]: StructureLink}
  storageLinks: StructureLink[]
  storageLinkMaps: {[id: string]: StructureLink}
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
