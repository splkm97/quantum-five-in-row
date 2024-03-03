import React from "react";

export type StoneProps = {
    stoneType: number;
}

const getClassName = (stoneType: number): string => {
    if (stoneType === 1) {
        return "black";
    } else if (stoneType === -1) {
        return "white";
    } else if (stoneType === 2) {
        return "black-90";
    } else if (stoneType === 3) {
        return "black-70";
    } else if (stoneType === -2) {
        return "white-90";
    } else if (stoneType === -3) {
        return "white-70";
    }
    return "empty"
}
const getStoneTxt = (stoneType: number): string => {
    if (stoneType === 1) {
        return "";
    } else if (stoneType === -1) {
        return "";
    } else if (stoneType === 2) {
        return "90";
    } else if (stoneType === 3) {
        return "70";
    } else if (stoneType === -2) {
        return "10";
    } else if (stoneType === -3) {
        return "30";
    }
    return "error";
}

export const Stone: React.FC<StoneProps> = (stoneProps) => {
    const stoneClassName = getClassName(stoneProps.stoneType)
    const stoneTxt = getStoneTxt(stoneProps.stoneType)

    return (
        <div className={`go-stone ${stoneClassName}`}>{stoneTxt}</div>
    )
}