// Pure Mathematical and Array Utilities
function calculateMovingAverage(dataPoints, windowSize) {
    const results = [];
    for (let i = 0; i <= dataPoints.length - windowSize; i++) {
        const windowSlice = dataPoints.slice(i, i + windowSize);
        const sum = windowSlice.reduce((acc, val) => acc + val, 0);
        results.push(sum / windowSize);
    }
    return results;
}

function deepCloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = { calculateMovingAverage, deepCloneObject };
