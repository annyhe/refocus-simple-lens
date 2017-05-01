/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Lenses/SimpleLens/src/main.js
 *
 * Sets up event handlers and DOM manipulations in response to streamd-in data.
 */
'use strict';
require('./lens.css');
const subjectsData = require('../../../public/datasets/one-level.json');
const aspectsData = require('../../../public/datasets/one-level-aspects.json');
const loadingTemplate = require('./template/gameSpace.handlebars');
const renderStage = require('./game').renderStage;
const realtimeChangeHandler = require('./utils').realtimeChangeHandler;
const getIndexOfSubjectAndSample = require('./utils').getIndexOfSubjectAndSample;
const LENS_ELEMENT = document.getElementById('lens');
const subjects = new Set(); // set of objects. each subject contains an array of samples

/**
 * Perform your DOM manipulation here.
 */
function draw() {
  console.log(new Date(), 'drawing');
  const STAGE = document.getElementById('stage');
  const infoHolder = document.getElementById('info');
  for (let subj of subjects) {
    const { subjectIndex, sampleIndexes } = getIndexOfSubjectAndSample(subj, subjectsData, aspectsData);
    // info.innerHTML = 'subject ' + subj.absolutePath + ', is at index ' +
    //   subjectIndex + ' has ' + subj.samples.length + ' samples' + ' and they are at ' + sampleIndexes;
    for (let i = sampleIndexes.length - 1; i >= 0; i--) {
      // highlight samples
      const sampleNode = STAGE.childNodes[subjectIndex].childNodes[sampleIndexes[i]];
      sampleNode.className = 'highlight';
      window.setTimeout(function(){
        // remove class after a time period
        sampleNode.className = '';
      }, 1000); //<-- Delay in milliseconds
    }
  }

  // document.getElementById('subjectsArr').innerHTML = '# of Columns:' + subjects.size + ', ' + [...subjects].map((subj) => subj.name);
} // draw

const eventTarget = {
  document: document,
  lens: LENS_ELEMENT,
  window: window,
};

/**
 * All the event handlers configured here will be registered on
 * refocus.lens.load.
 */
const eventHandler = {
  lens: {

    /**
     * Handle the refocus.lens.realtime.change event. The array of changes is
     * stored in evt.detail. Iterate over the array to perform any preprocessing
     * if needed, then call draw only once after all the data manipulation is
     * done.
     */
    'refocus.lens.realtime.change': (evt) => {
      console.log(new Date(), 'refocus.lens.realtime.change',
        'contains ' + evt.detail.length + ' changes');
      if (!Array.isArray(evt.detail) || evt.detail.length == 0) {
        return;
      }

      evt.detail.forEach((chg) => {
        if (chg['sample.add']) {
          realtimeChangeHandler.onSampleAdd(chg['sample.add'], subjects)
        } else if (chg['sample.remove']) {
          realtimeChangeHandler.onSampleRemove(chg['sample.remove'], subjects)
        } else if (chg['sample.update']) {
          realtimeChangeHandler.onSampleUpdate(chg['sample.update'], subjects);
        } else if (chg['subject.add']) {
          realtimeChangeHandler.onSubjectAdd(chg['subject.add'], subjects)
        } else if (chg['subject.remove']) {
          realtimeChangeHandler.onSubjectRemove(chg['subject.remove'], subjects)
        } else if (chg['subject.update']) {
          realtimeChangeHandler.onSubjectUpdate(chg['subject.update'], subjects)
        }
      }); // evt.detail.forEach

      // Now that we've processed all these changes, draw!
      draw();
    }, // refocus.lens.realtime.change
  },
}; // eventHandler

/*
 * Handle the load event. Register listeners for interesting window and lens
 * events here. This would also be a good place to render any DOM elements
 * which are not dependent on the hierarchy data (e.g. page header, page
 * footer, legend, etc.).
 */
LENS_ELEMENT.addEventListener('refocus.lens.load', () => {
  console.log(new Date(), '#lens => refocus.lens.load');
  LENS_ELEMENT.innerHTML = loadingTemplate();
  renderStage(subjectsData.children.length, aspectsData.length);

  // Register all the event listeners configured in eventHandler.
  Object.keys(eventHandler).forEach((target) => {
    Object.keys(eventHandler[target]).forEach((eventType) => {
      eventTarget[target].addEventListener(eventType, eventHandler[target][eventType]);
    });
  });
}); // "load" event listener
