/** Every sheet the app can show, with the data it needs. */
export type SheetState =
  | { type: 'memoryForm'; memoryId: string | null }
  | { type: 'memoryDetail'; memoryId: string }
