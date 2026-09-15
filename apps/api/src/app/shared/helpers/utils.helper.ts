import { randomInt } from "crypto";

// helpers/string.helper.ts
export function capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

//
export function truncate(value: string, length: number) {
    return value.length > length
        ? value.slice(0, length) + '...'
        : value;
}

// src/common/helpers/generate-code.helper.ts
export function generateCode(length = 6): string {
    const characters = '0123456789';

    return Array.from({ length }, () =>
    characters[randomInt(characters.length)],
    ).join('');
}
