/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface SpriteState {
  currentInteraction: string | null;
  interactionProgress: number | null;
  interactionChangesRemaining: number;
  conditions: string[];
  objectsNearBy: string[];
}

const initialState: SpriteState = {
  currentInteraction: 'idle',
  interactionProgress: null,
  interactionChangesRemaining: 0,
  conditions: [],
  objectsNearBy: [],
};

export const spriteSlice = createSlice({
  name: 'sprite',
  initialState,
  reducers: {
    resetSprite: () => initialState,
    changeInteraction: (state, action: PayloadAction<string | null>) => {
      state.currentInteraction = action.payload;
    },
    decrementInteractionChangesRemaining: (state) => {
      state.interactionChangesRemaining -= 1;
    },
    setInteractionChangesRemaining: (state, action: PayloadAction<number>) => {
      state.interactionChangesRemaining = action.payload;
    },
    addCondition: (state, action: PayloadAction<string>) => {
      state.conditions.push(action.payload);
    },
    removeCondition: (state, action: PayloadAction<string>) => {
      state.conditions = state.conditions.filter(
        (condition) => condition !== action.payload
      );
    },

    setInteractionProgress: (state, action: PayloadAction<number | null>) => {
      state.interactionProgress = action.payload;
    },
    loadSpriteStateFromDb: (state, action: PayloadAction<SpriteState>) => {
      state.currentInteraction = action.payload.currentInteraction;
      state.interactionProgress = action.payload.interactionProgress;
      state.interactionChangesRemaining =
        action.payload.interactionChangesRemaining;
      state.conditions = action.payload.conditions;
    },
    updateObjectsNearBy: (state, action: PayloadAction<string[]>) => {
      state.objectsNearBy = action.payload;
    },
  },
});

export const {
  resetSprite,
  changeInteraction,
  decrementInteractionChangesRemaining,
  setInteractionChangesRemaining,
  addCondition,
  removeCondition,
  updateObjectsNearBy,
  setInteractionProgress,
  loadSpriteStateFromDb,
} = spriteSlice.actions;

export const selectSprite = (state: RootState): SpriteState => state.sprite;

export const selectConditions = (state: RootState): string[] =>
  state.sprite.conditions;

export const selectCurrentInteraction = (state: RootState): string | null =>
  state.sprite.currentInteraction;
export const selectInteractionProgress = (state: RootState): number | null =>
  state.sprite.interactionProgress;
export const selectInteractionChangesRemaining = (state: RootState): number =>
  state.sprite.interactionChangesRemaining;

export default spriteSlice.reducer;
