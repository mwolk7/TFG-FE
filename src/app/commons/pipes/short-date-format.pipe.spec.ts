import { ShortDateFormatPipe } from './short-date-format.pipe';

describe('DateFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortDateFormatPipe();
    expect(pipe).toBeTruthy();
  });

  it('date 28/02/2020 equal 28/02/2020', () => {
    const pipe = new ShortDateFormatPipe();
    let date = new Date()
    date.setDate(28)
    date.setMonth(1)
    date.setFullYear(2020)
    expect(pipe.transform(date)).toEqual('28/02/2020')
  });


});
