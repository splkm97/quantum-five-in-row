import React, {useCallback, useEffect, useState} from "react";
import {Stone, StoneProps} from "./stone";
import {get, toInteger} from 'lodash-es';
import axios from "axios";

const BOARD_SIZE_X = 20;
const BOARD_SIZE_Y = 20;
const BOARD_CELL_COUNT = BOARD_SIZE_X * BOARD_SIZE_Y;
const BOARD_CELL_SIZE_PX = 30; // 30px per cell
const BOARD_TOTAL_SIZE_PX = BOARD_SIZE_X * BOARD_CELL_SIZE_PX; // 600px

interface BoardResponse {
    play_data: Array<Array<number>>;
}

interface StonePlacementResponse extends Array<Array<number>> {}
interface ObserveResponse extends Array<Array<number>> {}

const baseURL = process.env.REACT_APP_BASE_URL

export const GameBoard: React.FC = () => {
    const [stones, setStones] = useState<Array<StoneProps>>(Array(BOARD_CELL_COUNT).fill(null));
    const [observedStones, setObservedStones] = useState<Array<StoneProps>>(Array(BOARD_CELL_COUNT).fill(null));
    const [isObserved, setIsObserved] = useState<boolean>(false);
    useEffect(() => {
        // TODO: mygame 퇴출 필요..
        const eventSource = new EventSource(`${baseURL}/api/game/mygame/stream`);

        eventSource.onmessage = (event) => {
            const boardData = JSON.parse(event.data);
            const newStones: Array<StoneProps> = [];
            boardData.forEach((curLine: Array<number>, yIdx: number) => {
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
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [setStones]); // isObserved is no longer a dependency for the stream

    const newGameClicked = useCallback(() => {
        // TODO: mygame 퇴출 필요..
        axios.post<BoardResponse>(`${baseURL}/api/game/mygame`, {
            x_size: BOARD_SIZE_X,
            y_size: BOARD_SIZE_Y
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((resp) => {
                const newStones: Array<StoneProps> = []
                resp.data.play_data.forEach((curLine: Array<number>, yIdx: number) => {
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
                setStones(newStones)
                if (isObserved) {
                    setIsObserved(false);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [isObserved, setIsObserved]);

    const observeClicked = () => {
        if (!isObserved) {
            // TODO: mygame 퇴출 필요..
            axios.post<ObserveResponse>(baseURL + "/api/game/mygame/result")
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
            const x = index % BOARD_SIZE_X;
            const y = toInteger(index / BOARD_SIZE_Y);
            axios.post<StonePlacementResponse>(`${baseURL}/api/game/mygame/stone?x=${x}&y=${y}`)
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
            <div className={`grid grid-cols-${BOARD_SIZE_X} w-[600px] h-[600px] bg-[#FFCC02]`}>
                {!isObserved && stones.map((stone, index) => (
                    <div key={index} className={`w-[30px] h-[30px] z-auto relative`} onClick={() => placeStone(index)}>
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#333] transform -translate-y-1/2"></div>
                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#333] transform -translate-x-1/2"></div>
                        {stone && <><Stone stoneType={get(stone, "stoneType")} /></>}
                    </div>
                ))}
                {isObserved && observedStones.map((observedStone, index) => (
                    <div key={index} className={`w-[30px] h-[30px] z-auto relative`} onClick={() => placeStone(index)}>
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#333] transform -translate-y-1/2"></div>
                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#333] transform -translate-x-1/2"></div>
                        {observedStone && <><Stone stoneType={get(observedStone, "stoneType")} /></>}
                    </div>
                ))}
            </div>
            <div>
                <button className="rounded-lg bg-[#ddd] border-none text-black px-[10px] py-[10px] text-center no-underline inline-block text-base my-1 mx-0.5 cursor-pointer" onClick={newGameClicked}>NEW GAME</button>
                <button className={isObserved ? "rounded-lg bg-black border-none text-white px-[10px] py-[10px] text-center no-underline inline-block text-base my-1 mx-0.5 cursor-pointer" : "rounded-lg bg-[#ddd] border-none text-black px-[10px] py-[10px] text-center no-underline inline-block text-base my-1 mx-0.5 cursor-pointer"} onClick={observeClicked}>{isObserved && "finish observe"}{!isObserved && "strart observe!"}</button>
            </div>
        </>
    );
}
