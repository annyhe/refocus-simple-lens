/**
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Lenses/SimpleLens/src/utils.js
 *
 * Utility functions to kep the client-side subject and sample data
 * updated with streamed-in data
 */

/**
 * Return the index of the subject in the subjectsData, and
 * the indexes of the subject's samples from aspectsData
 * @param {Object} subject with samples array
 * @param {Array} subjectsData All allowable subjects
 * @param {Array} aspectsData All allowable aspects
 * @returns {Object} { Integer_index, [ int_index1, int_index2, ... ]}
*/
function getIndexOfSubjectAndSample(subject, subjectsData, aspectsData) {
  let subjectIndex = -1;
  for (let i = subjectsData.children.length - 1; i >= 0; i--) {
    if (subjectsData.children[i].absolutePath === subject.absolutePath) {
      subjectIndex = i;
      break;
    }
  }

  const sampleIndexes = [];
  for (let i = subject.samples.length - 1; i >= 0; i--) {
    const aspectName = subject.samples[i].name.split('|')[1];
    sampleIndexes.push(aspectsData.indexOf(aspectName));
  }

  return { subjectIndex, sampleIndexes };
}

const realtimeChangeHandler = {
  onSampleAdd(sample, subjects) {
    const subjectPath = sample.name.split('|')[0];
    for (let subject of subjects) {
      subject.samples = subject.samples ? subject.samples : [];
      if (subject.absolutePath === subjectPath) {
        subject.samples.push(sample);
        break;
      }
    }
  },
  onSampleRemove(sample, subjects) {
    const subjectPath = sample.name.split('|')[0];
    for (let subject of subjects) {
      if (subject.absolutePath === subjectPath) {
        const index = subject.samples.indexOf(sample);
        subject.samples = subject.samples.filter((samp) => {
          return samp.name !== sample.name;
        })
        break;
      }
    }
  },
  onSampleUpdate(change, subjects) {
    let sample = change.new;
    const subjectPath = sample.name.split('|')[0];
    for (let subject of subjects) {
      if (subject.absolutePath === subjectPath) {
        subject.samples = subject.samples ? subject.samples : [];
        const sampleNames = subject.samples.map((samp) => {
          return samp.name;
        });
        // get sample by name
        const index = sampleNames.indexOf(sample.name);
        subject.samples[index] = sample;
        break;
      }
    }
  },
  onSubjectAdd(subject, subjects) {
    subjects.add(subject);
  },
  onSubjectRemove(subject, subjects) {
    subjects.delete(subject);
  },
  onSubjectUpdate(change, subjects) {
    const updatedSubject = change.new;
    // update the subject. keep the samples of the old
    let oldSubject = {};
    for (let subject of subjects) {
      if (subject.id === updatedSubject.id) {
        oldSubject = subject;
        break;
      }
    }

    const samples = oldSubject.samples;
    subjects.delete(oldSubject);
    updatedSubject.samples = samples;
    subjects.add(updatedSubject);
  }
}; // realtimeChangeHandler

module.exports = {
  realtimeChangeHandler,
  getIndexOfSubjectAndSample,
};
