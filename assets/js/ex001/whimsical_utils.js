/**
 * Returns a random value between `min` e `max`.
 *
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @returns {number} Random value.
 */
export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generates a random hex color value.
 * @returns {number} Random hex color value.
 */
export const getRandomColor = () => {
    /** @type {string[]} */
    const whimsicalPalette = [
        "#F89B2A",
        "#C4473D",
        "#EAD046",
        "#2D3E50",
        "#2E2E2E",
        "#FF5F87",
        "#A54A00",
        "#F6C945",
        "#247BA0",
        "#6E5A8A",
        "#B81E3E",
        "#F9D54C",
        "#CC2A2B",
        "#E57E2F",
        "#1E1E1E",
        "#453327",
        "#AF835C",
    ];
    return whimsicalPalette[
        Math.floor(Math.random() * whimsicalPalette.length)
    ];
};
