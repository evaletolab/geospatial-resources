## Main usage

            var nora = require('./lib/nora_engine')();

            // nora ->
            // { update_position: [Function],
            //   current_zone_id: [Function],
            //   assets_for_current_zone: [Function],
            //   current_asset: [Function],
            //   signal_asset_complete: [Function] }

            nora.current_asset();
            // returns 
            // { status: { code: 1, message: 'uninitialized gps position' },
            //   asset: null,
            //   progression: { progression: 0, name: 'Initiateur' } }
            // we don't return assets as long as no gps position has been set set.

            // initialize engine
            nora.update_position({coords:{longitude: 6.13511323928833, latitude: 45.19984317040266}});
            // call on any gps change (expects a Position object -> https://developer.mozilla.org/en-US/docs/Web/API/Position)

            nora.current_asset();
            // returns 
            // successive calls return the same object
            { status: { code: 0, message: 'operation succesful' },
              asset:  { id: 'recTPIyk4ljDZwCiW',
                        zone: 'other',
                        title: 'Un temps en suspens',
                        audio_file: [{}],
                        doc_url: 'http://www.liminaire.fr/derives/article/arrete-ton-cinema',
                        text: '',
                        image: [{}] ] },
              progression: { progression: 8.333333333333334, name: 'Initiateur' } }

            // when asset has finished playing
            // call signal_asset_complete
            nora.signal_asset_complete();
            // returns next computed asset

            // we know the story is complete when we receive following state
            // { status: { code: 2, message: 'story ended (no more narrative positions)' },
            //     asset: null,
            //     progression: { progression: 100, name: null } }



## Installation
For node installation, NVM is a nice tool, https://github.com/creationix/nvm

From github,    

    git clone https://github.com/evaletolab/geospatial-resources
    cd geospatial-resources
    make install
    make test

Easiest way to install geospatial-resources is by using npm *(not yet ready for production)*:

    npm install --save geospatial-resources


## Running unit tests

To run unit tests you need [Mocha](https://github.com/visionmedia/mocha),
and [should.js](https://github.com/visionmedia/should.js). The tests are run simply by simply typing:

    NODE_ENV=test ./node_modules/.bin/mocha
    #or
    make test


## build

### development

The development build uses geographical areas based on the rue des maraîchers in geneva (cf docs/zone\_info)

            gulp build_library_for_development

### production

The production build uses the areas based on the ile St-Louis in paris (cf docs/zone\_info)

            gulp build_library_for_production

##Overview
TODO


## License
The API is available under AGPL V3 to protect the long term interests of the community – you are free to use it with no restrictions but if you change the server code, then those code changes must be contributed back.

> Copyright (c) 2016 Olivier Evalet (http://evaletolab.ch/)<br/>
> Copyright (c) 2016 David Hodgetts (http://www.demainlalune.ch/)<br/>
> <br/><br/>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the “Software”), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
> <br/>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
> <br/>
> THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
