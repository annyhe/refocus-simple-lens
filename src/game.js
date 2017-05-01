/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Lenses/SimpleLens/src/game.js
 *
 * Specifies game-centric DOM manipulations
 */
function updateScore() {
  let score = parseInt(document.getElementById('score').innerHTML);
  document.getElementById('score').innerHTML = score+=1;
}

function renderStage(height, width) {
  for (let i = height; i > 0; i--) {
      const div = document.createElement('div');
      for (let j = width; j > 0; j--) {
          const p = document.createElement('p');
          p.onclick = function(event) {
            if (event.target.className ==='highlight') {
              updateScore();
              event.target.className = '';
            }
          };
          div.appendChild(p);
      }
      document.getElementById('stage').appendChild(div);
  }
}

module.exports = {
  updateScore,
  renderStage,
};
