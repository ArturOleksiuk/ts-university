"use strict";
function triangle(value1, type1, value2, type2) {
    const types = ["leg", "hypotenuse", "adjacent angle", "opposite angle", "angle"];
    const MIN_VALUE = 1e-4;
    const MAX_VALUE = 1e4;
    if (!types.includes(type1) || !types.includes(type2)) {
        console.log("Некоректний тип аргументу!");
        return "failed";
    }
    if (value1 <= 0 || value2 <= 0) {
        console.log("Введені значення не можуть бути від'ємними або нульовими");
        return "failed";
    }
    if (value1 < MIN_VALUE || value2 < MIN_VALUE || value1 > MAX_VALUE || value2 > MAX_VALUE) {
        console.log("Введені значення не входять в допустимий діапазон");
        return "failed";
    }
    const toRadians = (angle) => (angle * Math.PI) / 180;
    const toDegrees = (radians) => (radians * 180) / Math.PI;
    let a, b, c, alpha, beta;
    if (type1 === "leg" && type2 === "leg") {
        a = value1;
        b = value2;
        c = Math.sqrt(a ** 2 + b ** 2);
        alpha = toDegrees(Math.atan(a / b));
        beta = 90 - alpha;
    }
    else if ((type1 === "leg" && type2 === "hypotenuse") ||
        (type1 === "hypotenuse" && type2 === "leg")) {
        a = type1 === "leg" ? value1 : value2;
        c = type1 === "hypotenuse" ? value1 : value2;
        if (a >= c) {
            console.log("Катет не бути більшим або рівним гіпотенузі.");
            return "failed";
        }
        b = Math.sqrt(c ** 2 - a ** 2);
        alpha = toDegrees(Math.asin(a / c));
        beta = 90 - alpha;
    }
    else if ((type1 === "leg" && type2 === "adjacent angle") ||
        (type1 === "adjacent angle" && type2 === "leg")) {
        a = type1 === "leg" ? value1 : value2;
        beta = type1 === "adjacent angle" ? value1 : value2;
        if (beta <= 0 || beta >= 90) {
            console.log("Кут має бути гострим.");
            return "failed";
        }
        c = a / Math.cos(toRadians(beta));
        b = Math.sqrt(c * c - a * a);
        alpha = 90 - beta;
    }
    else if ((type1 === "leg" && type2 === "opposite angle") ||
        (type1 === "opposite angle" && type2 === "leg")) {
        a = type1 === "leg" ? value1 : value2;
        alpha = type1 === "opposite angle" ? value1 : value2;
        if (alpha <= 0 || alpha >= 90) {
            console.log("Кут має бути гострим.");
            return "failed";
        }
        c = a / Math.sin(toRadians(alpha));
        b = Math.sqrt(c * c - a * a);
        beta = 90 - alpha;
    }
    else if ((type1 === "hypotenuse" && type2 === "angle") ||
        (type2 === "hypotenuse" && type1 === "angle")) {
        c = type1 === "hypotenuse" ? value1 : value2;
        alpha = type1 === "angle" ? value1 : value2;
        if (alpha <= 0 || alpha >= 90) {
            console.log("Кут має бути гострим.");
            return "failed";
        }
        a = c * Math.sin(toRadians(alpha));
        b = c * Math.cos(toRadians(alpha));
        beta = 90 - alpha;
    }
    else {
        console.log("Некоректні типи аргументів.");
        return "failed";
    }
    console.log(`a = ${a.toFixed(2)}, b = ${b.toFixed(2)}, c = ${c.toFixed(2)}, alpha = ${alpha.toFixed(2)}°, beta = ${beta.toFixed(2)}°`);
    return "success";
}
function testTriangle() {
    console.log("Test 1: Two legs (3, 4)");
    console.assert(triangle(3, "leg", 4, "leg") === "success", "Failed Test 1");
    console.log("Test 2: Leg and hypotenuse (3, 5)");
    console.assert(triangle(3, "leg", 5, "hypotenuse") === "success", "Failed Test 2");
    console.log("Test 3: Hypotenuse and leg (5, 3)");
    console.assert(triangle(5, "hypotenuse", 3, "leg") === "success", "Failed Test 3");
    console.log("Test 4: Leg and adjacent angle (3, 45°)");
    console.assert(triangle(3, "leg", 45, "adjacent angle") === "success", "Failed Test 4");
    console.log("Test 5: Leg and opposite angle (3, 30°)");
    console.assert(triangle(3, "leg", 30, "opposite angle") === "success", "Failed Test 5");
    console.log("Test 6: Hypotenuse and angle (5, 30°)");
    console.assert(triangle(5, "hypotenuse", 30, "angle") === "success", "Failed Test 6");
    console.log("Test 7: Invalid type");
    console.assert(triangle(3, "side", 4, "leg") === "failed", "Failed Test 7");
    console.log("Test 8: Negative value");
    console.assert(triangle(-3, "leg", 4, "leg") === "failed", "Failed Test 8");
    console.log("Test 9: Leg greater than or equal to hypotenuse");
    console.assert(triangle(5, "leg", 3, "hypotenuse") === "failed", "Failed Test 9");
    console.log("Test 10: Angle is not acute (90°)");
    console.assert(triangle(5, "hypotenuse", 90, "angle") === "failed", "Failed Test 10");
}
testTriangle();