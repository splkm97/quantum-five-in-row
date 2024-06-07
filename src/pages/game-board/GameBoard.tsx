import React, {useCallback, useEffect, useState} from "react";
import "../../styles/board.css"
import {Stone, StoneProps} from "./stone";
import {get, toInteger} from 'lodash-es';
import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL

export const GameBoard: React.FC = () => {
    const [stones, setStones] = useState<Array<StoneProps>>(Array(400).fill(null));
    const [observedStones, setObservedStones] = useState<Array<StoneProps>>(Array(400).fill(null));
    const [isObserved, setIsObserved] = useState<boolean>(false);
    const newGameClicked = () => {
        axios.post(`${baseURL}/api/game/mygame`, {
            "x_size": '20',
            "y_size": '20'
        })
            .then((resp) => {
                const newStones: Array<StoneProps> = []
                resp.data.forEach((curLine: Array<number>, yIdx: number) => {
                    curLine.forEach((curStone: number, xIdx: number) => {
                        newStones.push({
                            stoneType: 0,
                        })
                    })
                })
                setStones(newStones)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const observeClicked = () => {
        if (!isObserved) {
            // TODO: mygame 퇴출 필요..
            axios.post(baseURL + "/api/game/mygame/result")
                .then((resp) => {
                    const observedBoard = resp.data;
                    const curObservedStone: Array<StoneProps> = Array(400).fill(null);

                    observedBoard.forEach((curLine: Array<number>, yIdx: number) => {
                        const bias = yIdx * curLine.length;
                        curLine.forEach((curStone: number, xIdx: number) => {
                            if (curStone === 1) {
                                curObservedStone[bias + xIdx] = {
                                    stoneType: -1,
                                };
                            } else if (curStone === -1) {
                                curObservedStone[bias + xIdx] = {
                                    stoneType: 1,
                                }
                            }
                        })
                    })
                    setObservedStones(curObservedStone);
                })
                .catch((error) => {
                    console.log('error occurred in observe, err: ', error);
                    throw error;
                });
        }
        setIsObserved((ori) => !ori);
    }

    const placeStone = (index: number) => {
        if (!isObserved) {
            // TODO: mygame 퇴출 필요..
            const x = index % 20;
            const y = toInteger(index / 20);
            axios.post(`${baseURL}/api/game/mygame/stone?x=${x}&y=${y}`)
                .then((resp) => {
                    const board = resp.data;
                    const newStones: Array<StoneProps> = Array(0).fill(null);
                    board.forEach((curLine: Array<number>, yIdx: number) => {
                        curLine.forEach((curStone: number, xIdx: number) => {
                            if (curStone >= 0.8) {
                                newStones.push({
                                    stoneType: 2
                                })
                            } else if (curStone >= 0.5 && curStone < 0.8) {
                                newStones.push({
                                    stoneType: 3
                                })
                            } else if (curStone >= 0.2 && curStone < 0.5) {
                                newStones.push({
                                    stoneType: -3
                                })
                            } else if (curStone > 0 && curStone < 0.2) {
                                newStones.push({
                                    stoneType: -2
                                })
                            } else {
                                newStones.push({
                                    stoneType: 0
                                })
                            }
                        })
                    })
                    setStones(newStones);
                })
                .catch((error) => {
                    console.log(error)
                });
        }
    };

    return (
        <>
            <div className="go-board">
                {!isObserved && stones.map((stone, index) => (
                    <div key={index} className="go-cell" onClick={() => placeStone(index)}>
                        {stone && <><Stone stoneType={get(stone, "stoneType")} /></>}
                    </div>
                ))}
                {isObserved && observedStones.map((observedStone, index) => (
                    <div key={index} className="go-cell" onClick={() => placeStone(index)}>
                        {observedStone && <><Stone stoneType={get(observedStone, "stoneType")} /></>}
                    </div>
                ))}
            </div>
            <div>
                <button className="button-basic" onClick={newGameClicked}>NEW GAME</button>
                <button className={isObserved ? "button-checked" : "button-basic"} onClick={observeClicked}>{isObserved && "finish observe"}{!isObserved && "strart observe!"}</button>
            </div>
        </>
    );
}
