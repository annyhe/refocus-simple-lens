/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Lenses/SimpleLens/test/realTime.js
 */
'use strict';

const expect = require('chai').expect;
const realtimeChangeHandler = require('../src/utils').realtimeChangeHandler;
const ZERO = 0;
const ONE = 1;

describe('realtime events:', () => {
  const NAME = 'toot';
  const ID = "461ed5e0-0976-47c6-8cee-b9e1d0864fdc";
  const SUBJECT = {
    "absolutePath": "Fellowship",
    "childCount": 11,
    "id": ID,
    "name": "Fellowship",
    "parentAbsolutePath": "",
    "parentId": "",
    "samples": [],
    "tags": ["Tag1", "Tag2", "Tag3"],
  };
  const MINIMAL_SAMPLE = {
    name: "Fellowship|minimalSample",
    status: 'OK',
  };

  describe('subject events: ', () => {
    it('onAdd: subjects are added from set', () => {
      const subjects = new Set();
      realtimeChangeHandler.onSubjectAdd(SUBJECT, subjects);
      expect(subjects.size).to.equal(ONE);
    });

    it('onRemove: subjects are deleted from set', () => {
      const subjects = new Set([SUBJECT]);
      realtimeChangeHandler.onSubjectRemove(SUBJECT, subjects);
      expect(subjects.size).to.equal(ZERO);
    });

    it('onUpdate: subject is updated in set', () => {
      // name is updated
      const newSubject = {
        "absolutePath": NAME,
        "childCount": 11,
        "id": ID,
        "name": NAME,
        "parentAbsolutePath": "",
        "parentId": "",
        "samples": [MINIMAL_SAMPLE],
        "tags": ["Tag1", "Tag2", "Tag3"],
      };
      const subjects = new Set([SUBJECT]);
      realtimeChangeHandler.onSubjectUpdate({ new: newSubject }, subjects);
      expect(subjects.size).to.equal(ONE);
      // check the subject has been renamed
      const subj = subjects.values().next().value;
      expect(subj.name).to.equal(NAME);
      // check the samples array of subject has not changed
      expect(subj.samples).to.deep.equal([]);
    });
  });

  describe('sample events: ', () => {
    const subjects = new Set([SUBJECT]);

    it('onAdd: sample is added to subjects', () => {
      realtimeChangeHandler.onSampleAdd(MINIMAL_SAMPLE, subjects);
      const subj = subjects.values().next().value;
      expect(subj.samples).to.deep.equal([MINIMAL_SAMPLE]);
    });

    it('onRemove: sample is removed from subjects', () => {
      SUBJECT.samples = [MINIMAL_SAMPLE];
      const subjects = new Set([SUBJECT]);
      realtimeChangeHandler.onSampleRemove(MINIMAL_SAMPLE, subjects);
      const subj = subjects.values().next().value;
      // check the samples array of subject has not changed
      expect(subj.samples).to.deep.equal([]);
    });

    it('onUpdate: sample is updated in subjects', () => {
      SUBJECT.samples = [MINIMAL_SAMPLE];
      const subjects = new Set([SUBJECT]);
      const updatedSample = { name: MINIMAL_SAMPLE.name, status: 'Critical' };
      realtimeChangeHandler.onSampleUpdate({ new: updatedSample }, subjects);
      const subj = subjects.values().next().value;
      // check the samples array of subject has not changed
      expect(subj.samples).to.deep.equal([updatedSample]);
    });
  });
});
