if (typeof exports === 'object') {
    _ = require('lodash');
    Config = require('../../browser-config');
}
describe('browser-config', function () {
    describe('#get()', function () {
        var config, undef;

        // define a configuration object
        beforeEach(function () {
            config = new Config({
                a: 'aa',
                b: [1, 2],
                c: {a: 'aa'},
                d: null,
                e: {
                    aa: 'aaa',
                    bb: [1, 2],
                    cc: {a: 'aaa'},
                    dd: null
                },
                f: {
                    aa: {
                        aaa: {
                            aaaa: 'aaaaa',
                            bbbb: [1, 2],
                            cccc: {a: 'aaaaa'},
                            dddd: null
                        }
                    }
                }
            });
        });

        describe('with no key', function () {
            it('should return all data', function () {
                config.get().should.be.exactly(config.data);
            });
        });
        describe('with first level value', function () {
            it('should return expected scalar', function () {
                config.get('a').should.be.exactly('aa');
            });
            it('should return expected array', function () {
                config.get('b').should.eql([1, 2]);
            });
            it('should return expected object', function () {
                config.get('c').should.eql({a: 'aa'});
            });
            it('should return undefined if key does not exist and no alt is provided', function () {
                should.assert(!config.get('z'));
            });
            it('should return alt if key does not exist and alt is provided', function () {
                config.get('z', 'z').should.be.exactly('z');
            });
            it('should return alt if value is null and alt is provided', function () {
                var res = config.get('d', 'z');
                should.assert(res, "should be defined");
                res.should.be.exactly('z');
            });
        });

        describe('with second level values', function () {
            it('should return expected scalar', function () {
                config.get('e.aa').should.be.exactly('aaa');
            });
            it('should return expected array', function () {
                config.get('e.bb').should.be.eql([1, 2]);
            });
            it('should return expected object', function () {
                config.get('e.cc').should.be.eql({a: 'aaa'});
            });
            it('should return undefined if key does not exist and no alt is provided', function () {
                should.assert(!config.get('e.zz'));
            });
            it('should return alt if key does not exist and alt is provided', function () {
                config.get('e.zz', 'z').should.be.exactly('z');
            });
            it('should return alt if value is null and alt is provided', function () {
                var res = config.get('e.dd', 'z');
                should.assert(res, "should be defined");
                res.should.be.exactly('z');
            });
        });

        describe('with deeply nested value', function () {
            it('should return expected scalar', function () {
                config.get('f.aa.aaa.aaaa').should.be.exactly('aaaaa');
            });
            it('should return expected array', function () {
                config.get('f.aa.aaa.bbbb').should.be.eql([1, 2]);
            });
            it('should return expected object', function () {
                config.get('f.aa.aaa.cccc').should.be.eql({a: 'aaaaa'});
            });
            it('should return undefined if key does not exist and no alt is provided', function () {
                should.assert(!config.get('f.aa.aaa.zzzz'));
            });
            it('should return alt if key does not exist and alt is provided', function () {
                config.get('f.aa.aaa.zzzz', 'z').should.be.exactly('z');
            });
            it('should return alt if value is null and alt is provided', function () {
                var res = config.get('f.aa.aaa.dddd', 'z');
                should.assert(res, "should be defined");
                res.should.be.exactly('z');
            });
        });
    });
});
