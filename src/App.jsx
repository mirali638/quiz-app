import React, { useState } from 'react';
import Quiz from './components/quiz/Quiz';

const App = () => {
    const [startQuiz, setStartQuiz] = useState(false);

    return (
        <>
            {startQuiz ? (
                <Quiz />
            ) : (
                <div className="start-container">
                    <h1>Welcome to the Quiz App</h1>
                    <hr />
                    <button onClick={() => setStartQuiz(true)}>Start Quiz</button>
                </div>
            )}
        </>
    );
};

export default App;