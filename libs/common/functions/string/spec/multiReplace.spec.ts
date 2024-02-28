import { expect } from 'chai';
import {multiReplace} from '../multiReplace';

describe('multiReplace()', function() {
  describe('Basic validations', function() {
    it('Checking basic test Replace Object Key without quotes', function() {
      let strInput = 'The way forword',
        strOutput = multiReplace(strInput,{The:'Rasik',way:'E',forword:'C'});
      expect(strOutput).to.equal('Rasik E C');
    });
    it('Checking basic test Replace Object <not equal>', function() {
      let strInput = '!The way f*orword!*',
        strOutput = multiReplace(strInput,{'*':'replaced'});
      expect(strOutput).to.not.equal('!The way f*orword!*');
    });
    it('Checking basic test Replace Object Key with quotes', function() {
      let strInput = 'The way forword',
        strOutput = multiReplace(strInput,{'The':'Rasik','way':'E','forword':'C'});
      expect(strOutput).to.equal('Rasik E C');
    });
    it('Checking basic test Replace Object Key contain Regexp', function() {
      let strInput = 'The way forword - (/a|b/g)',
        strOutput = multiReplace(strInput,{'/a|b/g':'replaced'});
      expect(strOutput).to.equal('The way forword - (replaced)');
    });
    it('Checking basic test Replace Object Key not exist in input test', function() {
      let strInput = 'The way forword - (/a|b/g)',
        strOutput = multiReplace(strInput,{'_':'replaced'});
      expect(strOutput).to.equal('The way forword - (/a|b/g)');
    });
  });
});
