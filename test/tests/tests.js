describe('browser-config', function () {
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

    describe('#get()', function () {

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

        describe('with array of keys', function () {
            it('should return an array of values', function () {
                config.get(['a', 'e.aa', 'f.aa.aaa.aaaa', 'z'], 'z')
                    .should.be.eql(['aa', 'aaa', 'aaaaa', 'z']);
            });
        });

        describe('Doc examples', function () {
            it('should execute first example', function () {
                var o = new Config({a: {b: {c: 'foo'}}});
                o.get('a.b.c').should.be.exactly('foo');
                o.get('a.b.d', 'default').should.be.exactly('default');
            });

            it('should execute second example', function () {
                var o = new Config({a: {b: {c: 'foo'}}});
                o.get(['a.b.c', 'a.b.d'], 'default'); // returns ['foo', 'default']
            });
        });
    });

    describe('#set()', function () {

        describe('with no key', function () {
            it('should accept plain objects', function () {
                config.set({
                    a: 1,
                    b: {a: 1}
                });
                config.get('a').should.eql(1);
                config.get('b.a').should.eql(1);
            });
        });

        describe('on first level', function () {

            it('should update scalar', function () {
                config.set('a', 'new');
                config.get('a').should.eql('new');
            });

            it('should replace existing object', function () {
                // check original value is there
                config.get('c.a').should.eql('aa');
                // replace value
                config.set('c', {'new': 'new'});
                // check new value is there
                config.get('c.new').should.eql('new');
                // chack original value is not there
                should.assert(!config.get('c.a'), "original properties should not be defined");
            });

        });

        describe('on second level', function () {

            it('should update scalar', function () {
                config.set('e.aa', 'new');
                config.get('e.aa').should.eql('new');
            });

            it('should replace existing object', function () {
                // check original value is there
                config.get('e.cc.a').should.eql('aaa');
                // replace value
                config.set('e.cc', {'new': 'new'});
                // check new value is there
                config.get('e.cc.new').should.eql('new');
                // chack original value is not there
                should.assert(!config.get('e.cc.a'), "original properties should not be defined");
            });

        });

        describe('on deeply nested level', function () {

            it('should update scalar', function () {
                config.set('f.aa.aaa.aaaa', 'new');
                config.get('f.aa.aaa.aaaa').should.eql('new');
            });

            it('should replace existing object', function () {
                // check original value is there
                config.get('f.aa.aaa.cccc.a').should.eql('aaaaa');
                // replace value
                config.set('f.aa.aaa.cccc', {'new': 'new'});
                // check new value is there
                config.get('f.aa.aaa.cccc.new').should.eql('new');
                // chack original value is not there
                should.assert(!config.get('f.aa.aaa.cccc.a'), "original properties should not be defined");
            });

        });

        describe('Doc examples', function () {
            it('should execute first example', function () {
                var o = new Config({a: {b: {c: 'foo'}}});
                o.set('a.b.c', 'bar');
                o.set('d.e.f', 'baz');
                o.get('a.b.c').should.eql('bar');
                o.get('d.e.f').should.eql('baz');
            });

            it('should execute second example', function () {
                var o = new Config({a: {b: {c: 'foo'}}});
                o.set({
                    'a.b.c': 'bar',
                    'd.e.f': 'baz'
                });
                o.get('a.b.c').should.eql('bar');
                o.get('d.e.f').should.eql('baz');
            });
        });

    });

    describe('#subset()', function () {

        it('should return a config object', function () {
            config.subset('e').should.be.an.instanceOf(Config);
        });

        it('should return expected subset', function () {
            config.subset('e').data.should.eql(config.get('e'));
        });

    });
});
