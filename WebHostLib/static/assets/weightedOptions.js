let deletedOptions = {};

window.addEventListener('load', () => {
  // Generic change listener. Detecting unique qualities and acting on them here reduces initial JS initialisation time
  // and handles dynamically created elements
  document.addEventListener('change', (evt) => {
    // Handle clicks on world names
    if (evt.target.type === 'checkbox' && evt.target.classList.contains('world-collapse')) {
      // Collapse all option groups within the world if the checkbox was unchecked
      if (!evt.target.checked) {
        const worldName = evt.target.getAttribute('data-world-name');
        document.querySelectorAll(`input[type=checkbox].group-collapse`).forEach((checkbox) => {
          if (checkbox.hasAttribute('data-world-name') && checkbox.getAttribute('data-world-name') === worldName) {
            checkbox.checked = false;
          }
        });
      }
    }

    // Handle updates to range inputs
    if (evt.target.type === 'range') {
      // Update span containing range value. All ranges have a corresponding `{rangeId}-value` span
      document.getElementById(`${evt.target.id}-value`).innerText = evt.target.value;

      // If the changed option was the name of a game, determine whether to show or hide that game's div
      if (evt.target.id.startsWith('game||')) {
        const gameName = evt.target.id.split('||')[1];
        const gameDiv = document.getElementById(`${gameName}-container`);
        if (evt.target.value > 0) {
          gameDiv.classList.remove('hidden');
        } else {
          gameDiv.classList.add('hidden');
        }
      }
    }
  });

  // Generic click listener
  document.addEventListener('click', (evt) => {
    // Handle creating new rows for Range options
    if (evt.target.classList.contains('add-range-option-button')) {
      const [worldName, optionName] = evt.target.getAttribute('data-option').split('-');
      addRangeRow(worldName, optionName);
    }

    // Handle deleting range rows
    if (evt.target.classList.contains('range-option-delete')) {
      const targetRow = document.querySelector(`tr[data-row="${evt.target.getAttribute('data-target')}"]`);
      setDeletedOption(
        targetRow.getAttribute('data-world-name'),
        targetRow.getAttribute('data-option-name'),
        targetRow.getAttribute('data-value'),
      );
      targetRow.parentElement.removeChild(targetRow);
    }
  });

  // Listen for enter presses on inputs intended to add range rows
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
      evt.preventDefault();
    }

    if (evt.key === 'Enter' && evt.target.classList.contains('range-option-value')) {
      const [worldName, optionName] = evt.target.getAttribute('data-option').split('-');
      addRangeRow(worldName, optionName);
    }
  });

  // Detect form submission
  document.getElementById('weighted-options-form').addEventListener('submit', (evt) => {
    // Save data to localStorage
    const weightedOptions = {};
    document.querySelectorAll('input[name]').forEach((input) => {
      const keys = input.getAttribute('name').split('||');

      // Determine keys
      const worldName = keys[0] ?? null;
      const optionName = keys[1] ?? null;
      const subOption = keys[2] ?? null;

      // World name must be present
      if (!worldName) {
        return console.error(`Invalid option parsed: ${JSON.stringify(keys)}`);
      }

      // Ensure keys exist
      if (!weightedOptions[worldName]) { weightedOptions[worldName] = {}; }
      if (optionName && !weightedOptions[worldName][optionName]) { weightedOptions[worldName][optionName] = {}; }
      if (subOption && !weightedOptions[worldName][optionName][subOption]) {
        weightedOptions[worldName][optionName][subOption] = null;
      }

      if (subOption) { return weightedOptions[worldName][optionName][subOption] = determineValue(input); }
      if (optionName) { return weightedOptions[worldName][optionName] = determineValue(input); }
      if (worldName) { return weightedOptions[worldName] = determineValue(input); }
    });

    localStorage.setItem('weightedOptions', JSON.stringify(weightedOptions));
    localStorage.setItem('deletedOptions', JSON.stringify(deletedOptions));

    evt.preventDefault();
  });

  // Remove all deleted values as specified by localStorage.deletedOptions
  deletedOptions = JSON.parse(localStorage.getItem('deletedOptions') || '{}');
  Object.keys(deletedOptions).forEach((worldName) => {
    Object.keys(deletedOptions[worldName]).forEach((optionName) => {
      deletedOptions[worldName][optionName].forEach((value) => {
        const targetRow = document.querySelector(`tr[data-row="value"]`);
        targetRow.parentElement.removeChild(targetRow);
        // TODO: Fix me!
      });
    });
  });

  // TODO: Populate all settings from localStorage on page initialisation

  // TODO: Show or hide game divs based on game choice weights
});

const addRangeRow = (worldName, optionName) => {
  const inputQuery = `input[type=number][data-option="${worldName}-${optionName}"].range-option-value`;
  const inputTarget = document.querySelector(inputQuery);
  const newValue = inputTarget.value;
  if (!/^\d+$/.test(newValue)) {
    alert('Range values must be a whole number!');
    return;
  }
  inputTarget.value = '';
  const tBody = document.querySelector(`table[data-option="${worldName}-${optionName}"].range-rows tbody`);
  const tr = document.createElement('tr');
  tr.setAttribute('data-row', `${worldName}-${optionName}-${newValue}-row`);
  tr.setAttribute('data-world-name', worldName);
  tr.setAttribute('data-option-name', optionName);
  tr.setAttribute('data-value', newValue);
  const tdLeft = document.createElement('td');
  tdLeft.classList.add('td-left');
  const label = document.createElement('label');
  label.setAttribute('for', `${worldName}||${optionName}||${newValue}`);
  label.innerText = newValue.toString();
  tdLeft.appendChild(label);
  tr.appendChild(tdLeft);
  const tdMiddle = document.createElement('td');
  tdMiddle.classList.add('td-middle');
  const range = document.createElement('input');
  range.setAttribute('type', 'range');
  range.setAttribute('min', '0');
  range.setAttribute('max', '50');
  range.setAttribute('value', '0');
  range.setAttribute('id', `${worldName}||${optionName}||${newValue}`);
  range.setAttribute('name', `${worldName}||${optionName}||${newValue}`);
  tdMiddle.appendChild(range);
  tr.appendChild(tdMiddle);
  const tdRight = document.createElement('td');
  tdRight.classList.add('td-right');
  const valueSpan = document.createElement('span');
  valueSpan.setAttribute('id', `${worldName}||${optionName}||${newValue}-value`);
  valueSpan.innerText = '0';
  tdRight.appendChild(valueSpan);
  tr.appendChild(tdRight);
  const tdDelete = document.createElement('td');
  const deleteSpan = document.createElement('span');
  deleteSpan.classList.add('range-option-delete');
  deleteSpan.classList.add('js-required');
  deleteSpan.setAttribute('data-target', `${worldName}-${optionName}-${newValue}-row`);
  deleteSpan.innerText = '❌';
  tdDelete.appendChild(deleteSpan);
  tr.appendChild(tdDelete);
  tBody.appendChild(tr);

  // Remove this option from the set of deleted options if it exists
  unsetDeletedOption(worldName, optionName, newValue);
};

/**
 * Determines the value of an input element, or returns a 1 or 0 if the element is a checkbox
 *
 * @param {object} input - The input element.
 * @returns {number} The value of the input element.
 */
const determineValue = (input) => {
  return input.type === 'checkbox' ? (input.checked ? 1 : 0) : parseInt(input.value, 10);
};

/**
 * Sets the deleted option value for a given world and option name.
 * If the world or option does not exist, it creates the necessary entries.
 *
 * @param {string} worldName - The name of the world.
 * @param {string} optionName - The name of the option.
 * @param {*} value - The value to be set for the deleted option.
 * @returns {void}
 */
const setDeletedOption = (worldName, optionName, value) => {
  deletedOptions[worldName] = deletedOptions[worldName] || {};
  deletedOptions[worldName][optionName] = deletedOptions[worldName][optionName] || [];
  deletedOptions[worldName][optionName].push(`${worldName}-${optionName}-${value}`);
};

/**
 * Removes a specific value from the deletedOptions object.
 *
 * @param {string} worldName - The name of the world.
 * @param {string} optionName - The name of the option.
 * @param {*} value - The value to be removed
 * @returns {void}
 */
const unsetDeletedOption = (worldName, optionName, value) => {
  if (!deletedOptions.hasOwnProperty(worldName)) { return; }
  if (!deletedOptions[worldName].hasOwnProperty(optionName)) { return; }
  if (deletedOptions[worldName][optionName].includes(`${worldName}-${optionName}-${value}`)) {
    deletedOptions[worldName][optionName].splice(deletedOptions[worldName][optionName].indexOf(`${worldName}-${optionName}-${value}`), 1);
  }
  if (deletedOptions[worldName][optionName].length === 0) {
    delete deletedOptions[worldName][optionName];
  }
  if (Object.keys(deletedOptions[worldName]).length === 0) {
    delete deletedOptions[worldName];
  }
};
