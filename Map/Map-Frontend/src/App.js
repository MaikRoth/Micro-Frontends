import React, { useState, useEffect } from 'react';
import PlanetsGrid from './components/PlanetsGrid';

function App() {
    const [planets, setPlanets] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4002/topics/status')
            .then(response => response.json())
            .then(data => {
                const statuses = data.map(item => JSON.parse(item));
                const latestStatus = statuses[statuses.length - 1]?.status; 

                if (latestStatus === 'ended') {
                    setPlanets([]);
                } else if (latestStatus === 'started') {
                    fetch('http://localhost:4002/topics/gameworld')
                        .then(response => response.json())
                        .then(data => {
                            const allPlanets = data.flatMap(item => {
                                const parsedItem = JSON.parse(item);
                                return parsedItem.planets || [];
                            });
                            setPlanets(allPlanets);
                        })
                        .catch(error => console.error('Error fetching planets:', error));
                }
            })
            .catch(error => console.error('Error fetching status:', error));
    }, []);

    return (
        <div className="App">
            <PlanetsGrid planets={planets} />
        </div>
    );
}

export default App;
