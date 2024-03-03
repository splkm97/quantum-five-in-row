import React, {useEffect, useState} from "react";
import "../../styles/board.css"
import {Stone, StoneProps} from "./stone";
import { get } from 'lodash-es';


const getStoneProb = (stoneType: number): number => {
    if (stoneType === 1) {
        return 1;
    } else if (stoneType === -1) {
        return 0;
    } else if (stoneType === 2) {
        return 0.9;
    } else if (stoneType === 3) {
        return 0.7;
    } else if (stoneType === -2) {
        return 0.1;
    } else if (stoneType === -3) {
        return 0.3;
    }
    return -1;
}

export const GameBoard: React.FC = () => {
    const [stones, setStones] = useState<Array<StoneProps>>(Array(400).fill(null));
    const [nextStoneType, setNextStoneType] = useState(2);
    const [observedStones, setObservedStones] = useState<Array<StoneProps>>(Array(400).fill(null));
    const [isObserved, setIsObserved] = useState<boolean>(false);
    const [is90Turn, setIs90Turn] = useState<boolean>(true);
    const [isBlackTurn, setIsBlackTurn] = useState<boolean>(true);

    const set90Clicked = () => {
        setIs90Turn(true);
    }
    const set70Clicked = () => {
        setIs90Turn(false);
    }
    const setBlackClicked = () => {
        setIsBlackTurn(true);
    }
    const setWhiteClicked = () => {
        setIsBlackTurn(false);
    }
    useEffect(() => {
        if (isBlackTurn) {
            if (is90Turn) {
                setNextStoneType(2);
            } else {
                setNextStoneType(3);
            }
        } else {
            if (is90Turn) {
                setNextStoneType(-2);
            } else {
                setNextStoneType(-3);
            }
        }
    }, [is90Turn, isBlackTurn]);

    const observeClicked = () => {
        if (!isObserved) {
            const stonesCopy = [...stones];
            const curObservedStone: Array<StoneProps> = Array(400).fill(null)
            stonesCopy.forEach((curStone, index) => {
                if (curStone) {
                    const prob = getStoneProb(curStone.stoneType)
                    const isBlack = (Math.random() < prob)
                    if (isBlack) {
                        curObservedStone[index] = {
                            stoneType: 1,
                        };
                    } else {
                        curObservedStone[index] = {
                            stoneType: -1,
                        };
                    }
                }
            })
            setObservedStones(curObservedStone);
        }
        setIsObserved((ori) => !ori);
    }

    const turnChange = () => {
        if (isBlackTurn) {
            setIsBlackTurn(false);
        } else {
            setIs90Turn((ori) => !ori);
            setIsBlackTurn(true);
        }
    }
    const placeStone = (index: number) => {
        if (!isObserved) {
            const stonesCopy = [...stones];
            if (!stonesCopy[index]) {
                stonesCopy[index] = {
                    stoneType: nextStoneType
                };
                setStones(stonesCopy);
                turnChange();
            }
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
                <button className={nextStoneType > 2 || nextStoneType < -2 ? "button-basic" : "button-checked"} onClick={set90Clicked}>90%</button>
                <button className={nextStoneType > 2 || nextStoneType < -2 ? "button-checked" : "button-basic"} onClick={set70Clicked}>70%</button>
                <button className={nextStoneType < 0 ? "button-basic" : "button-checked"} onClick={setBlackClicked}>black</button>
                <button className={nextStoneType > 0 ? "button-basic" : "button-checked"} onClick={setWhiteClicked}>white</button>
                <button className={isObserved ? "button-checked" : "button-basic"} onClick={observeClicked}>{isObserved && "finish observe"}{!isObserved && "strart observe!"}</button>
            </div>
        </>
    );
}