import React from 'react';
import './PlanetsGrid.css';

const PlanetsGrid = ({ planets }) => {
  const gridSize = 15;
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  planets.forEach(planet => {
    if (grid[planet.y] && grid[planet.y][planet.x] === null) {
      grid[planet.y][planet.x] = planet;
    }
  });

  let planetCount = 0;
  let emptyCount = 0;
  grid.forEach(row => {
    row.forEach(cell => {
      if (cell) {
        planetCount += 1;
      } else {
        emptyCount += 1;
      }
    });
  });

  return (
    <>
      <div className="counts">
        <span>Planets: {planetCount}</span>
        <span>No Planets: {emptyCount}</span>
      </div>
      <div className="grid">
        {grid.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <div key={x} className={`cell ${cell ? 'planet' : 'empty'}`}>
                {cell && cell.resource ? (
                  <>
                    <div className="resource-type">[{cell.resource.resourceType || ''}]</div>
                    <div className="resource-amount">{formatResourceAmount(cell.resource.currentAmount)}</div>
                  </>
                ) : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

function formatResourceAmount(amount) {
  if (amount < 1000) {
    return amount.toString();
  } else {
    return (amount / 1000).toFixed(1) + 'k';
  }
}

export default PlanetsGrid;
