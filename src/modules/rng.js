/**
 * RNG module.
 * @module src/modules/rng
 * @see Math.random()
 */

/**
 * Static class containing Random Number Generator helper functions.
 */
class RNG {
    /**
     * Returns a random number between min (included) and max (excluded unless includeMax == true).
     * @param {number} min - The min value of the returned number.
     * @param {number} max - The max value of the returned number, excluded unless includeMax == true.
     * @param includeMax
     * @returns {number} - The returned random number.
     */
    static getRandomInt(min, max, includeMax=false) {
        // We don't use Math.round() because it would lead to an uneven distribution
        min = Math.ceil(min);
        max = Math.floor(max + includeMax); // includeMax being true causes max to become max+1, effectively including the max number ; max equals to max+0 otherwise
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

/**
 * Exports class RNG as default.
 */
export default RNG;
