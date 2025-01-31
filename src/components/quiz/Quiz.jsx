import React, { useRef, useState, useEffect } from 'react';
import "./Quiz.css";

const Quiz = () => {
    const [index, setIndex] = useState(0); // State for current question index
    const [question, setQuestion] = useState(null); // State for the current question
    const [lock, setLock] = useState(false); // State to lock the options after an answer is selected
    const [score, setScore] = useState(0); // State to track the user's score
    const [result, setResult] = useState(false); // State to determine if the quiz has ended
    const [data, setData] = useState([]); // State to hold the fetched quiz data
    const [loading, setLoading] = useState(true); // State to show loading status

    useEffect(() => {
        // Fetch quiz data from the API
        fetch('/api/Uw5CrX')
            .then(response => response.json())
            .then(apiData => {
                console.log("Fetched data:", apiData);
                // Format the fetched data to the required structure
                if (apiData.questions && apiData.questions.length > 0) {
                    const formattedData = apiData.questions.map(item => ({
                        question: item.description,
                        options: item.options.map(option => option.description),
                        ans: item.options.findIndex(option => option.is_correct) + 1,
                    }));
                    setData(formattedData); // Set the formatted data to state
                    setQuestion(formattedData[0]); // Set the first question
                    setLoading(false); // Set loading to false after data is fetched
                    console.log("Formatted data:", formattedData);
                } else {
                    console.error("No questions found in the API response.");
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);
    
    useEffect(() => {
        // Update the current question when the index or data changes
        if (data.length > 0) {
            setQuestion(data[index]);
            console.log("Current question:", data[index]);
        }
    }, [index, data]);

    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);

    const option_array = [Option1, Option2, Option3, Option4];

    const checkAns = (e, ans) => {
        // Check if the selected answer is correct
        if (lock === false && question) {
            if (question.ans === ans) {
                e.target.classList.add("correct");
                setLock(true);
                setScore(prev => prev + 1); // Increment score for correct answer
            } else {
                e.target.classList.add("wrong");
                setLock(true);
                option_array[question.ans - 1].current.classList.add("correct"); // Show the correct answer
            }
        }
    };

    const next = () => {
        // Move to the next question
        if (lock === true) {
            if (index === data.length - 1) {
                setResult(true); // End the quiz if it's the last question
                return;
            }
            setIndex(index + 1); // Increment the question index
            setLock(false); // Unlock options for the next question
            option_array.forEach(option => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
            });
        }
    };

    const reset = () => {
        // Reset the quiz to the initial state
        setIndex(0);
        setScore(0);
        setLock(false);
        setResult(false);
    };

    return (
        <div className='container'>
            <h1>Quiz app</h1>
            <hr />
            {loading ? (
                <p>Loading...</p> // Show loading status
            ) : result ? (
                <>
                    <h2>You scored {score} out of {data.length}</h2>
                    <button onClick={reset}>Reset</button> 
                </>
            ) : (
                <>
                    {question && <h2>{index + 1}. {question.question}</h2>}
                    <ul>
                        <li ref={Option1} onClick={(e) => { checkAns(e, 1) }}>{question?.options[0]}</li>
                        <li ref={Option2} onClick={(e) => { checkAns(e, 2) }}>{question?.options[1]}</li>
                        <li ref={Option3} onClick={(e) => { checkAns(e, 3) }}>{question?.options[2]}</li>
                        <li ref={Option4} onClick={(e) => { checkAns(e, 4) }}>{question?.options[3]}</li>
                    </ul>
                    <button onClick={next}>Next</button> 
                    <div className='index'>{index + 1} of {data.length} questions.</div> 
                </>
            )}
        </div>
    );
};

export default Quiz;