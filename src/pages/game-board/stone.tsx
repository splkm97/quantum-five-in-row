import React from "react";

export type StoneProps = {
    stoneType: number;
}

const getClassName = (stoneType: number): string => {
    if (stoneType === 1) {
        return "text-white bg-black";
    } else if (stoneType === -1) {
        return "text-black bg-white";
    } else if (stoneType === 2) {
        return "text-white bg-[#222]";
    } else if (stoneType === 3) {
        return "text-white bg-[#444]";
    } else if (stoneType === -2) {
        return "text-black bg-[#ddd]";
    } else if (stoneType === -3) {
        return "text-black bg-[#bbb]";
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
    } else if (stoneType === 0) {
        return "";
    }
    return "error";
}

export const Stone: React.FC<StoneProps> = (stoneProps) => {
    const stoneClassName = getClassName(stoneProps.stoneType)
    const stoneTxt = getStoneTxt(stoneProps.stoneType)

    // Tailwind classes for .go-stone
    const baseStoneClasses = "flex justify-center items-center w-6 h-6 rounded-full absolute text-sm top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2";

    return (
        <div className={`${baseStoneClasses} ${stoneClassName}`}>{stoneTxt}</div>
    )
}
