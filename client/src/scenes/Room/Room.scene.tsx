/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */

import { Stage, Layer, Rect, Image } from 'react-konva';
import React, { useEffect, useState } from 'react';
import { ReactReduxContext, Provider } from 'react-redux';
import useImage from 'use-image';
import game from '../../data/gameMap.data';
import Player from '../Player/player.component';
import { img } from '../../assets/library/index';

import './Room.styles.css';
import Clickables from '../clickables/clickables.component';

const Room = (): JSX.Element => {
  const canvasWidth = 800;
  const canvasHeight = 800;
  const { cols, layers, tileSize } = game;

  const [layerA, setLayerA] = useState<JSX.Element[]>([]);

  const [image] = useImage(img.wallImgs.wallB);

  const makeArray = (): JSX.Element[] => {
    const newArr = [];
    for (let yAxis = 0; yAxis < cols; yAxis++) {
      for (let xAxis = 0; xAxis < cols; xAxis++) {
        switch (layers[0][yAxis * cols + xAxis]) {
          case 0:
            newArr.push(
              <Image
                x={xAxis * tileSize}
                y={yAxis * tileSize}
                image={image}
                key={`${xAxis}, ${yAxis}`}
                height={tileSize}
                width={tileSize}
              />
            );
            break;
          default:
            newArr.push(
              <Rect
                x={xAxis * tileSize}
                y={yAxis * tileSize}
                key={`${xAxis}, ${yAxis}`}
                height={tileSize}
                width={tileSize}
                fill="pink"
              />
            );
        }
      }
    }
    return newArr;
  };

  useEffect(() => {
    setLayerA(makeArray());
  }, []);

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <Stage width={canvasWidth} height={canvasHeight}>
          <Provider store={store}>
            <Layer>{layerA}</Layer>
            <Layer>
              <Player />
            </Layer>
            <Clickables />
          </Provider>
        </Stage>
      )}
    </ReactReduxContext.Consumer>
  );
};

export default Room;
