// src/Calculator.js

import React, { useState, useEffect, useRef } from "react";
import "./style/Calculator.css"; // Create this CSS file for styling

const Calculator = () => {
    const [expression, setExpression] = useState("");
    const [result, setResult] = useState(null);
    const [isNewCalculation, setIsNewCalculation] = useState(false);
    const calculatorRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - calculatorRef.current.getBoundingClientRect().left,
            y: e.clientY - calculatorRef.current.getBoundingClientRect().top,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const { clientX, clientY } = e;
            calculatorRef.current.style.left = `${clientX - offset.x}px`;
            calculatorRef.current.style.top = `${clientY - offset.y}px`;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleButtonClick = (value) => {
        if (value === "=") {
            try {
                setResult(eval(expression)); // Use eval with caution!
                setExpression("");
            } catch (error) {
                setResult("Error");
                setExpression("");
            }
        } else if (value === "C") {
            setExpression("");
            setResult(null);
        } else {
            if (isNewCalculation && /[+\-*/]/.test(value)) {
                setExpression(result + value);
                setIsNewCalculation(false);
            } else if (isNewCalculation) {
                setExpression(value);
                setIsNewCalculation(false);
            } else {
                setExpression(expression + value);
            }
        }
    };

    const handleKeyPress = (e) => {
        const validKeys = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "+",
            "-",
            "*",
            "/",
            "Enter",
            "c",
            "Backspace",
        ];
        if (validKeys.includes(e.key)) {
            if (e.key === "Enter") {
                // Perform calculation
                try {
                    setResult(eval(expression));
                    setExpression("");
                } catch (error) {
                    setResult("Error");
                    setExpression("");
                }
            } else if (e.key === "c") {
                // Clear the input
                setExpression("");
                setResult(null);
            } else if (e.key === "Backspace") {
                // Remove the last character
                setExpression(expression.slice(0, -1));
            } else {
                if (isNewCalculation && /[+\-*/]/.test(e.key)) {
                    setExpression(result + e.key);
                    setIsNewCalculation(false);
                } else if (isNewCalculation) {
                    setExpression(e.key);
                    setIsNewCalculation(false);
                }
                // Add the key to the expression
                else {
                    setExpression(expression + (e.key === "Enter" ? "" : e.key));
                }
            }
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [expression, result, isNewCalculation]);

    useEffect(() => {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="calculator" ref={calculatorRef} onMouseDown={handleMouseDown}>
            <div className="display">{expression || (result !== null ? result : "")}</div>
            <div className="button-panel">
                {["7", "8", "9", "/"].map((item) => (
                    <button key={item} onClick={() => handleButtonClick(item)}>
                        {item}
                    </button>
                ))}
                {["4", "5", "6", "*"].map((item) => (
                    <button key={item} onClick={() => handleButtonClick(item)}>
                        {item}
                    </button>
                ))}
                {["1", "2", "3", "-"].map((item) => (
                    <button key={item} onClick={() => handleButtonClick(item)}>
                        {item}
                    </button>
                ))}
                {["C", "0", "=", "+"].map((item) => (
                    <button key={item} onClick={() => handleButtonClick(item)}>
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Calculator;
