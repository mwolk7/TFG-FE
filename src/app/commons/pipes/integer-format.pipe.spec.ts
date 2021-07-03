import { IntegerFormatPipe } from './integer-format.pipe';

describe('IntegerFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new IntegerFormatPipe();
    expect(pipe).toBeTruthy();
  });
  
  it('100 equal 100', () => {
    const pipe = new IntegerFormatPipe();
    
    expect(pipe.transform(100)).toEqual('100')
  });

  it('1000000000 equal 1.000.000.000', () => {
    const pipe = new IntegerFormatPipe();
    
    expect(pipe.transform(1000000000)).toEqual('1.000.000.000')
  });


});
