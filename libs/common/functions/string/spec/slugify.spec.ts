import { expect } from 'chai';
import {slugify} from '../slugify';

describe('slugify()', function() {
  describe('Basic validations', function() {
    it('Checking basic test input text only', function() {
      let strInput = 'The way forword',
        strOutput = slugify(strInput);
      expect(strOutput).to.equal('THE_WAY_FORWORD');
    });
    it('Checking basic test input text and typecast "L"', function() {
      let strInput = 'The way forword',
        strOutput = slugify(strInput,'U');
      expect(strOutput).to.equal('THE_WAY_FORWORD');
    });
    it('Checking basic test input text, typecast "U" and replace "-"', function() {
      let strInput = 'The way forword',
        strOutput = slugify(strInput,'U','-');
      expect(strOutput).to.equal('THE-WAY-FORWORD');
    });
    it('Checking basic test input text, typecast "L" and replace "-"', function() {
      let strInput = 'The way forword',
        strOutput = slugify(strInput,'L','/a|b/g');
      expect(strOutput).to.equal('the/a|b/gway/a|b/gforword');
    });
    it('Checking basic test input text, typecast "L" and replace "O"', function() {
      let strInput = 'The way forword',
        strOutput = slugify(strInput,'L','O');
      expect(strOutput).to.equal('theowayoforword');
    });
    it('Checking basic test input text contain Special carecter', function() {
      let strInput = '🐶*x*the way 4wrd* x',
        strOutput = slugify(strInput);
      expect(strOutput).to.equal('___X_THE_WAY_4WRD__X');
    });
  });
});
