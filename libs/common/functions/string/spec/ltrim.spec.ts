import { expect } from 'chai';
import {ltrim} from '../ltrim';

describe('ltrim()', function() {
  describe('Basic validations', function() {
    it('Checking basic test - <equal>', function() {
      let strInput = '  The way forword ',
        strOutput = ltrim(strInput);
      expect(strOutput).to.equal('The way forword ');
    });
    it('Checking basic test - <Not equal>', function() {
      let strInput = '  The way forword ',
        strOutput = ltrim(strInput);
      expect(strOutput).to.not.equal('  The way forword ');
    });
    it('Checking with argument <equal>', function() {
      let strInput = '!The way forword',
        strOutput = ltrim(strInput, '!');
      expect(strOutput).to.equal('The way forword');
    });
    it('Checking with argument <not equal>', function() {
      let strInput = '!The way forword',
        strOutput = ltrim(strInput, '!');
      expect(strOutput).to.not.equal('!The way forword');
    });
    it('Checking with argument <non trimmable carecter>', function() {
      let strInput = ' !The way forword',
        strOutput = ltrim(strInput, '!');
      expect(strOutput).to.equal(' !The way forword');
    });
  });
});
