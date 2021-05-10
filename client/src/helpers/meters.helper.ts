import { store } from '../app/store';
import {
  changeByAmount,
  MetersState,
  selectMeterValue,
} from '../features/meters/metersSlice';
import { MeterChange } from '../interfaces/meterChange.interface';
import { gameMinute } from '../data/time.data';
import { Meters } from '../data/meters.data';
import { triggerAddConditions, triggerRemoveConditions } from './sprite.helper';
import { Entity } from '../interfaces/entity.interface';
import { setCurrentInteraction } from './interactions.helper';

export const decayMeter = (change: MeterChange): void => {
  const { name } = change;
  const timer = setInterval(() => {
    const appStore = store.getState();
    const { meters } = appStore;
    const currentValue = meters[name as keyof MetersState].value;
    if (currentValue > 0) {
      store.dispatch(changeByAmount(change));
    }
    if (currentValue <= 0) {
      clearInterval(timer);
    }
  }, gameMinute * 5);
};

export const checkMeterStates = (meters: Meters): void => {
  const meterNames = Object.keys(meters);
  meterNames.forEach((meter) => {
    let deficitAdded = false;
    let excessAdded = false;
    setInterval(() => {
      const meterValue = selectMeterValue(store.getState().meters, meter);
      if (meterValue < meters[meter].deficitPoint && deficitAdded === false) {
        triggerAddConditions(meters[meter].deficitImpacts);
        deficitAdded = true;
      } else if (
        meterValue > meters[meter].excessPoint &&
        excessAdded === false
      ) {
        triggerAddConditions(meters[meter].excessImpacts);
        excessAdded = true;
      } else if (
        meterValue > meters[meter].deficitPoint &&
        deficitAdded === true
      ) {
        triggerRemoveConditions(meters[meter].deficitImpacts);
        deficitAdded = false;
      } else if (
        meterValue < meters[meter].excessPoint &&
        excessAdded === true
      ) {
        triggerRemoveConditions(meters[meter].excessImpacts);
        excessAdded = false;
      }
    }, gameMinute);
  });
};

export function deductCost(cost: number): boolean {
  const appStore = store.getState();
  const { value } = appStore.meters.money;
  if (value < cost) return false;
  const meterImpact = { name: 'money', amount: -cost };
  store.dispatch(changeByAmount(meterImpact));
  return true;
}

function triggerIncrementalChange(entityData: Entity, entity: string): void {
  const iterations = Math.round(entityData.timeToComplete / 1000);
  let iterationCount = iterations;
  const timer = setInterval(() => {
    const appStore = store.getState();
    const { currentInteraction } = appStore.sprite;
    if (currentInteraction !== entity) {
      clearInterval(timer);
      triggerRemoveConditions(entityData.conditions);
    } else if (iterationCount === 0) {
      clearInterval(timer);
      triggerRemoveConditions(entityData.conditions);
      setCurrentInteraction(null);
    } else {
      entityData.meterImpacts.forEach((meterImpact: MeterChange) => {
        const incrementalValue = Math.round(meterImpact.amount / iterations);
        store.dispatch(
          changeByAmount({ name: meterImpact.name, amount: incrementalValue })
        );
        iterationCount -= 1;
      });
    }
  }, gameMinute);
}

function triggerImmediateChange(entityData: Entity): void {
  entityData.meterImpacts.forEach((meterImpact: MeterChange) => {
    store.dispatch(changeByAmount(meterImpact));
  });
  triggerRemoveConditions(entityData.conditions);
  setCurrentInteraction(null);
}

export function triggerChangeMeters(entityData: Entity, entity: string): void {
  if (entityData.timeToComplete === 0) {
    triggerImmediateChange(entityData);
  } else {
    triggerIncrementalChange(entityData, entity);
  }
}
