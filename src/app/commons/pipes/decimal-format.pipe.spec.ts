import { DecimalFormatPipe } from './decimal-format.pipe';

describe('DecimalFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new DecimalFormatPipe();
    expect(pipe).toBeTruthy();
  });

  it('one digit: 100 equal 100,0', () => {
    const pipe = new DecimalFormatPipe();
    
    expect(pipe.transform(100, 1)).toEqual('100,0')
  });


  it('two digits: 100 equal 100,00', () => {
    const pipe = new DecimalFormatPipe();
    
    expect(pipe.transform(100)).toEqual('100,00')
  });

  it('one digit: 1000000000 equal 1.000.000.000,0', () => {
    const pipe = new DecimalFormatPipe();
    
    expect(pipe.transform(1000000000, 1)).toEqual('1.000.000.000,0')
  });


  it('two digits: 1000000000 equal 1.000.000.000,00', () => {
    const pipe = new DecimalFormatPipe();
    
    expect(pipe.transform(1000000000)).toEqual('1.000.000.000,00')
  });

});
